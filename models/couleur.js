import mongoose from 'mongoose';
const Schema = mongoose.Schema

const colorSchema = new Schema({
    colorHex: {
        type: String,
        enum : ['#FF5733', '#000000', '#FFFFFF', '#33DD1F', '#1460EF']
    },

    datePosted: { type: Date, default: Date.now },
  });

export default mongoose.model('Color',colorSchema)
