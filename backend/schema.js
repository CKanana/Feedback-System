const mongoose = require('mongoose');
// Survey Draft Schema
const SurveyDraftSchema = new mongoose.Schema({
	survey: { type: mongoose.Schema.Types.ObjectId, ref: 'Survey', required: true },
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	answers: [{ questionId: mongoose.Schema.Types.ObjectId, answer: mongoose.Schema.Types.Mixed }],
	updatedAt: { type: Date, default: Date.now }
});

// User Schema
const UserSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	role: { type: String, enum: ['admin', 'staff', 'user'], default: 'user' },
	department: { type: String },
	photo: { type: String }, // URL or base64 string for profile photo
	twoFactorSecret: { type: String },
	isTwoFactorEnabled: { type: Boolean, default: false },
	isAtive: { type: Boolean, default: true },
	jwtToken: { type: String },
	firebaseUid: { type: String }, // Link to Firebase Auth
	isVerified: { type: Boolean, default: false }, // Track email verification
	createdAt: { type: Date, default: Date.now }
});

// Poll Schema
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
	recipients: {
	  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	  departments: [String]
	},
	createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	createdAt: { type: Date, default: Date.now },
});


// Survey Schema
const QuestionSchema = new mongoose.Schema({
	text: { type: String, required: true },
	type: { type: String, enum: ['text', 'multiple-choice', 'rating'], default: 'text' },
	options: [String], // For multiple-choice
});

const ResponseSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	answers: [{ questionId: mongoose.Schema.Types.ObjectId, answer: mongoose.Schema.Types.Mixed }],
	submittedAt: { type: Date, default: Date.now },
});

const SurveySchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String },
	questions: [QuestionSchema],
	responses: [ResponseSchema],
	recipients: {
	  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	  departments: [String]
	},
	createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	createdAt: { type: Date, default: Date.now },
});

module.exports = {
	User: mongoose.model('User', UserSchema),
	Poll: mongoose.model('Poll', PollSchema),
	Survey: mongoose.model('Survey', SurveySchema),
	SurveyDraft: mongoose.model('SurveyDraft', SurveyDraftSchema)
};
