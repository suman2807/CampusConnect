import { connectToDatabase } from '../server/config/database.js';
import '../server/models/schemas.js';
import mongoose from 'mongoose';

const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.CLIENT_URL || '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};

export default async function handler(req, res) {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectToDatabase();
    
    const { method, query } = req;
    const { requestId, userId } = query;

    const Request = mongoose.model('Request');
    const User = mongoose.model('User');

    if (method === 'POST') {
      // Join request
      const { user: userData } = req.body;
      
      let user = await User.findOne({ clerkId: userData.clerkId });
      if (!user) {
        user = new User(userData);
        await user.save();
      }

      const request = await Request.findById(requestId);
      if (!request) {
        return res.status(404).json({ error: 'Request not found' });
      }

      if (request.createdBy.toString() === user._id.toString()) {
        return res.status(400).json({ error: 'Cannot join your own request' });
      }

      const alreadyJoined = request.interestedUsers.some(
        interested => interested.user.toString() === user._id.toString()
      );

      if (alreadyJoined) {
        return res.status(400).json({ error: 'Already joined this request' });
      }

      request.interestedUsers.push({
        user: user._id,
        joinedAt: new Date(),
        status: 'pending'
      });

      await request.save();
      
      const updatedRequest = await Request.findById(requestId)
        .populate('createdBy', 'fullName email profileImage')
        .populate('interestedUsers.user', 'fullName email profileImage');

      return res.status(200).json(updatedRequest);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Join API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
