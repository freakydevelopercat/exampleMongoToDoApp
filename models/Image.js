var mongoose = require('mongoose');
//datebase for image
var db2=mongoose.createConnection('mongodb://localhost/imageApp',function(err) {
    if(err) {
        console.log('connection error', err);
    } else {
        console.log('connection successful to imageApp');
    }});

var ImageSchema = new mongoose.Schema({
  name: String,
  note: String,
  img_src: String
});

module.exports = db2.model('Img', ImageSchema);