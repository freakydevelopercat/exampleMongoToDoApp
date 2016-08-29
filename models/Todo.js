var mongoose = require('mongoose');
//datebase for image
var db1=mongoose.createConnection('mongodb://localhost/todoApp',function(err) {
    if(err) {
        console.log('connection error', err);
    } else {
        console.log('connection successful to todoApp');
    }});

var TodoSchema = new mongoose.Schema({
  name: String,
  completed: Boolean,
  note: String,
  state: String
});

module.exports = db1.model('Todo', TodoSchema);