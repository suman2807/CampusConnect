import { connectToDatabase } from '../server/config/database.js';
import '../server/models/schemas.js';
import mongoose from 'mongoose';
import axios from 'axios';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.CLIENT_URL || 'http://localhost:5173',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};

export default async function handler(req, res) {
  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectToDatabase();

    const { method, url } = req;
    const path = url.split('/api')[1];

    switch (method) {
      case 'GET':
        if (path === '/health') {
          return res.status(200).json({ 
            status: 'OK', 
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development'
          });
        }
        
        if (path === '/requests') {
          const Request = mongoose.model('Request');
          const requests = await Request.find({})
            .populate('createdBy', 'fullName email profileImage')
            .populate('interestedUsers.user', 'fullName email profileImage')
            .sort({ createdAt: -1 });
          return res.status(200).json({ data: requests });
        }
        break;

      case 'POST':
        if (path === '/requests') {
          const Request = mongoose.model('Request');
          const User = mongoose.model('User');
          
          const { user: userData, requestData } = req.body;
          
          // Create or update user
          let user = await User.findOne({ clerkId: userData.clerkId });
          if (!user) {
            user = new User(userData);
            await user.save();
          }
          
          // Profanity check
          if (process.env.HUGGINGFACE_API_KEY) {
            try {
              const textToCheck = `${requestData.title} ${requestData.description}`;
              const response = await axios.post(
                'https://api-inference.huggingface.co/models/unitary/toxic-bert',
                { inputs: textToCheck },
                {
                  headers: {
                    'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                    'Content-Type': 'application/json'
                  },
                  timeout: 10000
                }
              );
              
              if (response.data && response.data[0]) {
                const toxicityScore = response.data[0].find(item => item.label === 'TOXIC')?.score || 0;
                if (toxicityScore > 0.7) {
                  return res.status(400).json({ error: 'Content contains inappropriate language' });
                }
              }
            } catch (error) {
              console.log('Profanity check failed, allowing content:', error.message);
            }
          }
          
          // Create request
          const newRequest = new Request({
            ...requestData,
            createdBy: user._id,
            status: 'open',
            interestedUsers: []
          });
          
          await newRequest.save();
          const populatedRequest = await Request.findById(newRequest._id)
            .populate('createdBy', 'fullName email profileImage');
          
          return res.status(201).json(populatedRequest);
        }
        break;

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }

    return res.status(404).json({ error: 'Not found' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
