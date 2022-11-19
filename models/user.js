import mongoose from 'mongoose';

const Schema = mongoose.Schema

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: [3, "Le nom est trop court"],
    maxlength: 20,
    validate: [{
      validator: validateString,
      message: 'Ce prénom {VALUE} contient des caractères spéciaux'
    }]
  },
  surname: {
    type: String,
    required: true,
    minlength: [2, "Le nom de famille est trop court"],
    maxlength: 20,
    validate: [{
      validator: validateString,
      message: 'Ce nom {VALUE} contient des caractères spéciaux'
    }]
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [{
        validator: validateEmailUnique,
        message: 'Mail {VALUE} déjà existant'

      },
      {
        validator: validateEmailFormat,
        message: 'Cet email {VALUE} contient des caractères spéciaux'
      }
    ]
  },
  password: {
    type: String,
    required: true,
<<<<<<< Updated upstream
    minlength: [8, "Le mot de passe est trop court"]
=======
    minlength: [8, "Le mot de passe doit contenir au moins 8 caractères"]
>>>>>>> Stashed changes

  },
  username: {
    type: String,
    required: true,
    unique: true,
    validate:
      // Manually validate uniqueness to send a "pretty" validation error
      // rather than a MongoDB duplicate key error
      [{
        validator: validateUsernameUnique,
        message: 'Username {VALUE} déjà existant'
      }]
  },
  age: {
    type: Number,
    // required: true,
    min: [13, "Tu dois avoir 13 ans au minimum"],
    max: 100
  },
  admin: {
    type: Boolean,
    default: false
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

function validateString(value) {
  const regex = /\b([A-ZÀ-ÿ][-a-z. ']+[ ]*)+/;
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