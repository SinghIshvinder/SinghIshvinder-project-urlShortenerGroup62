const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    urlCode : {type:String, unique:true, trim:true, lowercase:true},
    longUrl : {type:String, unique:true, trim:true, lowercase:true},
    shortUrl : {type:String, unique:true, trim:true, lowercase:true}
})

module.exports = mongoose.model('Url', urlSchema);



 


