const mongoose = require('mongoose');
const areasFile = require('./bh.json');

//extract the city name
const areas = areasFile.map(a => a.city);

const userSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email:{
type: String,
require: true,
  },
  hashedPassword: {
    type: String,
    require: true,
  },
  phone: {
    type:String,
    require:true,
  },
  area: {
    type: String,
    enum: areas,
    require: true,
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
