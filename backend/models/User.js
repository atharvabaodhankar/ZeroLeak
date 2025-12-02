const mongoose = require('mongoose');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: [true, 'Wallet address is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^0x[a-fA-F0-9]{40}$/.test(v);
      },
      message: 'Invalid Ethereum wallet address'
    }
  },
  name: {
    type: String,
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  role: {
    type: String,
    enum: {
      values: ['teacher', 'authority', 'examCenter'],
      message: '{VALUE} is not a valid role'
    },
    required: [true, 'Role is required']
  },
  nonce: {
    type: String,
    default: () => crypto.randomBytes(16).toString('hex')
  },
  isProfileComplete: {
    type: Boolean,
    default: false
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

// Update the updatedAt timestamp before saving
UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Generate a new nonce for the user
UserSchema.methods.generateNonce = function() {
  this.nonce = crypto.randomBytes(16).toString('hex');
  return this.nonce;
};

// Get the message to sign for authentication
UserSchema.methods.getSignMessage = function() {
  return `Sign this message to authenticate with ChainSeal.\n\nNonce: ${this.nonce}\nWallet: ${this.walletAddress}`;
};

module.exports = mongoose.model('User', UserSchema);
