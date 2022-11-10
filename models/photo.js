import mongoose from 'mongoose';

const Schema = mongoose.Schema

const photoSchema = new Schema({
  description: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  location: {
    latitute: Number,
    longitude: Number,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  color: {
    type: Schema.Types.ObjectId,
    ref: 'Color'
  },
  url: {
    type: String,
    required: true,
  }
}, {
  timestamps: true
});

export default mongoose.model('Photo', photoSchema)