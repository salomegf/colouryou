import mongoose from 'mongoose';
const Schema = mongoose.Schema

const colorSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    validate: [{
      validator: validateCouleurUnique,
      message: 'Cette couleur {VALUE} a déjà été enregistrée'
    }]
  },

  hex: {
    type: String,
    required: true,
    unique: true,
    minlength: [6, "Le Code Hexadecimal est trop court"],
    maxlength: [6, "Le Code Hexadecimal est trop long"],
    validate: [{
        validator: validateStringInteger,
        message: 'Cette couleur {VALUE} contient des caractères non autorisés'
      },
      {
        validator: validateHexUnique,
        message: 'Ce code couleur {VALUE} a déjà été enregistré'
      }
    ]
  },

  datePosted: {
    type: Date,
    default: Date.now
  },
});

function validateCouleurUnique(value) {
  return this.constructor
    .findOne()
    .where('name')
    .equals(value)
    .exec()
    .then(existingNameCouleur => {
      return !existingNameCouleur || existingNameCouleur._id.equals(this._id);
    })
}

function validateHexUnique(value) {
  return this.constructor
    .findOne()
    .where('hex')
    .equals(value)
    .exec()
    .then(existingHex => {
      return !existingHex || existingHex._id.equals(this._id);
    })
}

function validateStringInteger(value) {
  const regex = /([A-Z|0-9])/;
  return regex.test(value)
}

colorSchema.set("toJSON", {
  transform: transformJsonUser
});

function transformJsonUser(doc, json, options) {
  delete json.__v;
  return json;
}

export default mongoose.model('Color', colorSchema)