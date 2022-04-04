const express = require('express');
const app = express();
const mongoose = require('mongoose');
const route = require('../src/routes/route');

app.use(express.json());
app.use('/', route)

try {
    mongoose.connect("mongodb://0.0.0.0:27017/URL-Shortener", {useNewUrlParser:true});
    console.log(`MongoDB Connection Successful`);

} catch (error) {
    console.log(error);
}


const port = process.env.PORT || 3000;
app.listen(port, console.log(`Express App running on port ${port}`))