import mongoose from 'mongoose';

const Schema = mongoose.Schema

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: [3, "Name is too short"],
    maxlength: 20
  },
  surname: {
    type: String,
    required: true,
    minlength: [3, "Surname is too short"],
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Password is too short"],
    maxlength: 20
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  age: {
    type: Number,
    // required: true,
    min: [13, "You must be 13 years old"],
    max: 100
  },
});



export default mongoose.model('User', userSchema)