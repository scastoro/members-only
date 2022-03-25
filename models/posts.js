const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostsSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
  author: { type: Schema.Types.ObjectId, ref: 'Users' },
});

module.exports = mongoose.model('Posts', PostsSchema);
