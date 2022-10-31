import mongoose from 'mongoose';
const Schema = mongoose.Schema

const colorSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },

  hex: {
    type: String,
    required: true,
    unique: true,
    minlength: [6, "Code Hexadecimal is too short"],
    maxlength: 6
  },

  datePosted: {
    type: Date,
    default: Date.now
  },
});

export default mongoose.model('Color', colorSchema)