const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UsersSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true },
  status: { type: String, enum: ['non-member', 'member'] },
  posts: [{ type: Schema.Types.ObjectId, ref: 'Posts' }],
});

module.exports = mongoose.model('Users', UsersSchema);
