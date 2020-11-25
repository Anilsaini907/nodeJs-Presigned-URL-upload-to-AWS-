var express = require('express');
var multiparty = require('multiparty');
const BluebirdPromise = require('bluebird')
const AWS = require('aws-sdk');
var bodyParser = require('body-parser');
const fetch = require("node-fetch");
const multer = require('multer');
//const multer=require('multer-s3');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
const port = process.env.PORT || 3000;
app.use(bodyParser.json())
var req = require('request');
var fs = require('fs');
const uuid = require('uuid');

AWS.config.update({
    accessKeyId: 'AKIA5ZYC65IMKR3AN3MJ',
    secretAccessKey: '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',
    region: 'ap-south-1',
    // endpoint: 'http://127.0.0.1:9000',
    // s3ForcePathStyle: true,
    // signatureVersion: 'v4'
});
var s3 = new AWS.S3({
    //apiVersion: '2006-03-01',
    signatureVersion: 'v4',
});
const storage = multer.memoryStorage({
    destination: function(req, file, callback) {
        callback(null, '')
    },
    // limits: { fileSize: 5000000 },
})
const upload = multer({ storage }).single('file');
console.log(req.file);
//var body = req.file.buffer;
// let myFile = req.file.originalname;
// const fileType = myFile[myFile.length - 1]
const getSingedUrlforPut = async() => {
    const params = {
        Bucket: 'sspanil',
        Key: `${uuid}`,
        //Body: body,
        Expires: 60 * 5 * 5
    };
    try {
        const url = await new Promise((resolve, reject) => {
            s3.getSignedUrl('putObject', params, (err, url) => {
                err ? reject(err) : resolve(url);
            });
        });
        console.log(url)
    } catch (err) {
        if (err) {
            console.log(err)
        }
    }
}
getSingedUrlforPut()


app.listen(port, () =>
    console.log(`App is listening on port ${port}.`)
)