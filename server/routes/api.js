import express from 'express';
import { User, Request, Message, Feedback } from '../models/schemas.js';
import { checkProfanity } from '../proxy.mjs';

const router = express.Router();

// Middleware to verify Clerk user data from request body
const verifyClerkUser = async (req, res, next) => {
  try {
    // Get user data from request body or headers
    const userData = req.body.user;
    
    if (!userData || !userData.clerkId || !userData.email) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Attach user info to the request
    req.user = {
      clerkId: userData.clerkId,
      email: userData.email,
      fullName: userData.fullName || ''
    };
    
    next();
  } catch (error) {
    console.error('User verification error:', error);
    res.status(401).json({ error: 'Invalid authentication' });
  }
};

// User Routes
router.post('/users', async (req, res) => {
  try {
    const { clerkId, email, fullName, profileImage } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ clerkId });
    
    if (user) {
      // Update existing user
      user.email = email;
      user.fullName = fullName;
      user.profileImage = profileImage || user.profileImage;
      await user.save();
    } else {
      // Create new user
      user = new User({
        clerkId,
        email,
        fullName,
        profileImage
      });
      await user.save();
    }
    
    res.status(201).json({ message: 'User created/updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/users/:clerkId', async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.params.clerkId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Request Routes
router.post('/requests', verifyClerkUser, async (req, res) => {
  try {
    const requestData = {
      ...req.body,
      createdBy: {
        clerkId: req.user.clerkId,
        email: req.user.email,
        fullName: req.user.fullName
      }
    };
    
    // Remove the user object from requestData to avoid duplication
    delete requestData.user;
    
    const newRequest = new Request(requestData);
    await newRequest.save();
    
    res.status(201).json({ message: 'Request created successfully', request: newRequest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/requests', async (req, res) => {
  try {
    const { type, limit = 50, page = 1 } = req.query;
    
    const filter = type ? { type } : {};
    const requests = await Request.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/requests/:id', async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/requests/:id/join', verifyClerkUser, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    // Check if user is trying to join their own request
    if (request.createdBy.clerkId === req.user.clerkId) {
      return res.status(400).json({ error: 'Cannot join your own request' });
    }
    
    // Check if request is completed or cancelled
    if (request.status === 'completed' || request.status === 'cancelled') {
      return res.status(400).json({ error: 'Cannot join a completed or cancelled request' });
    }
    
    // Check if user already joined
    const alreadyJoined = request.interestedUsers.some(
      user => user.clerkId === req.user.clerkId
    );
    
    if (alreadyJoined) {
      return res.status(400).json({ error: 'Already joined this request' });
    }
    
    // Add user to interested users with timestamp and pending status
    request.interestedUsers.push({
      clerkId: req.user.clerkId,
      email: req.user.email,
      fullName: req.user.fullName,
      status: 'pending',
      joinedAt: new Date()
    });
    
    await request.save();
    res.json({ message: 'Successfully joined request', request });
  } catch (error) {
    console.error('Join request error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid request ID format' });
    }
    res.status(500).json({ error: 'Failed to join request. Please try again.' });
  }
});

router.delete('/requests/:id', verifyClerkUser, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    // Check if user is the request owner
    if (request.createdBy.clerkId !== req.user.clerkId) {
      return res.status(403).json({ error: 'Permission denied' });
    }
    
    await Request.findByIdAndDelete(req.params.id);
    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Chat Routes
router.post('/messages', verifyClerkUser, async (req, res) => {
  try {
    const { text, profileImage } = req.body;
    
    // Check for profanity
    const isOffensive = await checkProfanity(text);
    
    const messageData = {
      text: isOffensive ? '**** [Message filtered for inappropriate content] ****' : text,
      user: {
        clerkId: req.user.clerkId,
        email: req.user.email,
        fullName: req.user.fullName,
        profileImage: profileImage || ''
      },
      isFiltered: isOffensive,
      originalText: isOffensive ? text : undefined
    };
    
    const message = new Message(messageData);
    await message.save();
    
    res.status(201).json({ message: 'Message sent successfully', data: message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/messages', async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;
    
    const messages = await Message.find()
      .sort({ timestamp: 1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Request User Management Routes
router.put('/requests/:id/users/:userId/accept', verifyClerkUser, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    // Check if user is the request owner
    if (request.createdBy.clerkId !== req.user.clerkId) {
      return res.status(403).json({ error: 'Only request owner can accept users' });
    }
    
    // Find and update the interested user's status
    const userIndex = request.interestedUsers.findIndex(
      user => user.clerkId === req.params.userId
    );
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found in interested users list' });
    }
    
    request.interestedUsers[userIndex].status = 'accepted';
    await request.save();
    
    res.json({ message: 'User accepted successfully', request });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/requests/:id/users/:userId/reject', verifyClerkUser, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    // Check if user is the request owner
    if (request.createdBy.clerkId !== req.user.clerkId) {
      return res.status(403).json({ error: 'Only request owner can reject users' });
    }
    
    // Find and update the interested user's status
    const userIndex = request.interestedUsers.findIndex(
      user => user.clerkId === req.params.userId
    );
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found in interested users list' });
    }
    
    request.interestedUsers[userIndex].status = 'rejected';
    await request.save();
    
    res.json({ message: 'User rejected successfully', request });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Direct Message Routes
router.post('/messages/direct', verifyClerkUser, async (req, res) => {
  try {
    const { recipientClerkId, text } = req.body;
    
    if (!recipientClerkId || !text) {
      return res.status(400).json({ error: 'Recipient and message text are required' });
    }
    
    // Check if recipient exists
    const recipient = await User.findOne({ clerkId: recipientClerkId });
    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }
    
    // Check for profanity
    const isOffensive = await checkProfanity(text);
    
    const messageData = {
      text: isOffensive ? '**** [Message filtered for inappropriate content] ****' : text,
      sender: {
        clerkId: req.user.clerkId,
        email: req.user.email,
        fullName: req.user.fullName
      },
      recipient: {
        clerkId: recipient.clerkId,
        email: recipient.email,
        fullName: recipient.fullName
      },
      isFiltered: isOffensive,
      originalText: isOffensive ? text : undefined,
      messageType: 'direct'
    };
    
    const message = new Message(messageData);
    await message.save();
    
    res.status(201).json({ message: 'Direct message sent successfully', data: message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/messages/direct/:otherUserId', verifyClerkUser, async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const { limit = 50, page = 1 } = req.query;
    
    // Get direct messages between current user and other user
    const messages = await Message.find({
      $or: [
        {
          'sender.clerkId': req.user.clerkId,
          'recipient.clerkId': otherUserId,
          messageType: 'direct'
        },
        {
          'sender.clerkId': otherUserId,
          'recipient.clerkId': req.user.clerkId,
          messageType: 'direct'
        }
      ]
    })
      .sort({ timestamp: 1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Feedback Routes
router.post('/feedback', verifyClerkUser, async (req, res) => {
  try {
    const { issueFeedback, improvementFeedback } = req.body;
    
    const feedback = new Feedback({
      user: {
        clerkId: req.user.clerkId,
        email: req.user.email,
        fullName: req.user.fullName
      },
      issueFeedback,
      improvementFeedback
    });
    
    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully' });
// Admin middleware
const verifyAdmin = (req, res, next) => {
  const ADMIN_EMAILS = ['suman_saurabh@srmap.edu.in'];
  
  if (!req.user || !req.user.email || !ADMIN_EMAILS.includes(req.user.email)) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  next();
};

// Admin Routes
router.get('/admin/stats', verifyClerkUser, verifyAdmin, async (req, res) => {
  try {
    const totalRequests = await Request.countDocuments();
    const activeRequests = await Request.countDocuments({ status: 'open' });
    const completedRequests = await Request.countDocuments({ status: 'completed' });
    const totalUsers = await User.countDocuments();
    const totalMessages = await Message.countDocuments();
    const totalFeedback = await Feedback.countDocuments();
    
    res.json({
      totalRequests,
      activeRequests,
      completedRequests,
      totalUsers,
      totalMessages,
      totalFeedback
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/admin/requests', verifyClerkUser, verifyAdmin, async (req, res) => {
  try {
    const requests = await Request.find()
      .populate('createdBy', 'fullName email')
      .sort({ createdAt: -1 });
    
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/admin/users', verifyClerkUser, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find()
      .select('fullName email createdAt')
      .sort({ createdAt: -1 });
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/admin/requests/:id', verifyClerkUser, verifyAdmin, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    await Request.findByIdAndDelete(req.params.id);
    res.json({ message: 'Request deleted successfully by admin' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;