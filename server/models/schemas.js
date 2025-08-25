import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true
  },
  profileImage: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Request Schema (for all types of requests)
const requestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['sports', 'teammate', 'trips', 'lost-found', 'roommate'],
    required: true
  },
  createdBy: {
    clerkId: String,
    email: String,
    fullName: String
  },
  // Sports specific fields
  sportName: String,
  teamSize: Number,
  venue: String,
  date: Date,
  time: String,
  
  // Teammate specific fields
  skillsRequired: String,
  duration: String,
  teammateExpectations: String,
  teammateType: String,
  requirement: String,
  additionalInfo: String,
  
  // Travel specific fields
  destination: String,
  travellingFrom: String,
  travellingTo: String,
  timeOfTravel: String,
  travelMode: String,
  participants: Number,
  
  // Lost & Found specific fields
  itemName: String,
  itemDescription: String,
  dateLostFound: Date,
  locationLostFound: String,
  contactInfo: String,
  
  // Roommate specific fields
  preferences: String,
  budget: Number,
  location: String,
  moveInDate: Date,
  
  // Common fields
  userLimit: Number,
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  interestedUsers: [{
    clerkId: String,
    email: String,
    fullName: String,
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Chat Message Schema
const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  user: {
    clerkId: String,
    email: String,
    fullName: String,
    profileImage: String
  },
  // For direct messages
  sender: {
    clerkId: String,
    email: String,
    fullName: String
  },
  recipient: {
    clerkId: String,
    email: String,
    fullName: String
  },
  messageType: {
    type: String,
    enum: ['global', 'direct'],
    default: 'global'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  isFiltered: {
    type: Boolean,
    default: false
  },
  originalText: String // Store original text if it was filtered
});

// Feedback Schema
const feedbackSchema = new mongoose.Schema({
  user: {
    clerkId: String,
    email: String,
    fullName: String
  },
  issueFeedback: {
    type: String,
    required: true
  },
  improvementFeedback: {
    type: String,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for better performance (avoiding duplicates with unique constraints)
userSchema.index({ createdAt: 1 });
userSchema.index({ updatedAt: 1 });
requestSchema.index({ type: 1 });
requestSchema.index({ 'createdBy.clerkId': 1 });
requestSchema.index({ createdAt: -1 });
messageSchema.index({ timestamp: -1 });

// Pre-save middleware to update the updatedAt field
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

requestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Export models
export const User = mongoose.model('User', userSchema);
export const Request = mongoose.model('Request', requestSchema);
export const Message = mongoose.model('Message', messageSchema);
export const Feedback = mongoose.model('Feedback', feedbackSchema);