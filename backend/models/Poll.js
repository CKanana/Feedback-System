const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
});

const VotedBySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  option: { type: String },
});

const PollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [OptionSchema],
  anonymous: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
  votedBy: [VotedBySchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Poll', PollSchema);
