const urlModel = require('../models/urlModel');
const validUrl = require('valid-url');
const {nanoid} = require('nanoid');
const res = require('express/lib/response');
const baseUrl = "http://localhost:3000" //declaring a baseUrl and assigning it a value.
const redis = require('redis');
const {promisify} = require('util');

const redisClient = redis.createClient();
redisClient.connect();





const createShortUrl = async (req,res) => {
    try {
        
        let requestBody = req.body;
        if(Object.keys(requestBody).length == 0){
        return res.status(400).json({status:false, msg:`Invalid request. Insert some data in the body!`}); //validation for empty body.
        }
        let {longUrl} = requestBody; //taking input in postman body
        //const response = await redisClient.set("url", JSON.stringify(req.body));


        if(!validUrl.isUri(baseUrl)){ //validating our baseUrl
            return res.status(400).json({status:false, msg:`Invalid Base URL`});
        }
        const urlCode = nanoid(); //generating urlCode using nanoid package

        if(!validUrl.isUri(longUrl)){ //validation for longUrl
            return res.status(400).json({status:false, msg:`Invalid Long URL`});
        }
        if(validUrl.isUri(longUrl)){ 
            let url = await urlModel.findOne({longUrl}); //searching for longUrl in our DB.
            
            
            if(url){ //if longUrl is valid
                return res.status(201).json({status:true, data:url})
            }
            else{
                const shortUrl = baseUrl + '/' + urlCode; //making shortUrl
                url = new urlModel({ //creating a new instance of our model/schema
                    longUrl, shortUrl, urlCode    //including the changes in our documents
                })
                redisClient.setex("url", 120, JSON.stringify(shortUrl));
                await url.save(); //updating the above made changes
                return res.status(201).json({status:true, data:url})
                
            }
        }
        } catch (error) {
        res.status(500).json({status:false, error: error.message});
       
    }
    
}

const redirectShortUrl = async (req,res)=>{
    try {
        const cachedUrl = await redisClient.get(req.params.urlCode);
        const url = await urlModel.findOne({urlCode: req.params.urlCode});
        //searching DB if the entered urlCode is present?
        if(!url){
        return res.status(404).json({status:false, msg:`URL Not Found!`});
        //validation:- if the urlCode isn't present in our DB.
        }
        if(url){
        
        return res.redirect(302, url.longUrl);
         //if present, simply redirect it to the corresponding longUrl.
        }
    } catch (error) {
        res.status(500).json({status:false, error: error.message});
        console.log(error);
    }

}






module.exports = {
    createShortUrl,
    redirectShortUrl
}