const mongoose = require('mongoose');
const areasFile = require('./bh.json');

//extract the city name
const areas = areasFile.map(a => a.city);

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email:{
type: String,
required: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  phone: {
    type:String,
    required:true,
  },
  area: {
    type: String,
    enum: areas,
    required: true,
  },
  role: {
  type: String,
  enum: ["resident", "admin"],
  default: "resident",
},
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.hashedPassword;
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
