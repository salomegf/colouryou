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
  /* location: {
    latitute: Number,
    longitude: Number,
  }, */
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
  },
  location: {
    type: {
      type: String,
      required: true,
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: [{
        validator: validateGeoJsonCoordinates,
        message: '{VALUE} n\'est pas une coordonnée de longitude/latitude(/altitude) valide'
      }]
    }
  }
}, {
  timestamps: true
});

// Create a geospatial index on the location property.
photoSchema.index({
  location: '2dsphere'
});

// Validate a GeoJSON coordinates array (longitude, latitude and optional altitude).
function validateGeoJsonCoordinates(value) {
  return Array.isArray(value) && value.length >= 2 && value.length <= 3 && isLongitude(value[0]) && isLatitude(value[1]);
}

function isLatitude(value) {
  return value >= -90 && value <= 90;
}

function isLongitude(value) {
  return value >= -180 && value <= 180;
}

photoSchema.set("toJSON", {
  transform: transformJsonUser
});

function transformJsonUser(doc, json, options) {
  delete json.__v;
  return json;
}

export default mongoose.model('Photo', photoSchema)