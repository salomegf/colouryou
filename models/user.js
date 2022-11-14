import mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;
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
    minlength: [2, "Surname is too short"],
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [
      {
        validator: validateEmailUnique,
        message: 'Mail {VALUE} déjà existant'

      },
      {
        validator: validateEmailFormat,
        message: 'Cet email {VALUE} contient des caractères spéciaux'
      }]
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Password is too short"]

  },
  username: {
    type: String,
    required: true,
    unique: true,
    validate:
      // Manually validate uniqueness to send a "pretty" validation error
      // rather than a MongoDB duplicate key error
      [
        {
          validator: validateUsernameUnique,
          message: 'Username {VALUE} déjà existant'
        }
      ]
  },
  age: {
    type: Number,
    // required: true,
    min: [13, "Tu dois avoir 13 ans au minimum"],
    max: 100
  },
});

function validateUsernameUnique(value) {
  return this.constructor
    .findOne()
    .where('username')
    .equals(value)
    .exec()
    .then(existingUsername => {
      return !existingUsername || existingUsername._id.equals(this._id);
    });
}

function validateEmailUnique(value) {
  return this.constructor
    .findOne()
    .where('email')
    .equals(value)
    .exec()
    .then(existingEmail => {
      return !existingEmail || existingEmail._id.equals(this._id);
    })

}

function validateEmailFormat(value) {
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(value)


}




userSchema.set("toJSON", {
  transform: transformJsonUser
});



function transformJsonUser(doc, json, options) {
  // Remove the hashed password from the generated JSON.
  delete json.password;
  delete json.__v;
  return json;
}



export default mongoose.model('User', userSchema)