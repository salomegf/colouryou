import mongoose from 'mongoose';
const Schema = mongoose.Schema

const colorSchema = new Schema({
    // colorHex: {
    //     type: String,
    //     enum : ['#FF5733', '#000000', '#FFFFFF', '#33DD1F', '#1460EF']
    // },
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

    datePosted: { type: Date, default: Date.now },
  });

export default mongoose.model('Color', colorSchema)
