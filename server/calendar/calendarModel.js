var mongoose = require('mongoose');

var CalendarSchema = new mongoose.Schema({
  name: {
    type: String,
    require: false
  },
  number: {
    type: Number,
    default: 1
  }
});

module.exports = mongoose.model('calendar', CalendarSchema)
