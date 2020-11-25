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
const storage = multer.memoryStorage({
    destination: function(req, file, callback) {
        callback(null, '')
    },
    // limits: { fileSize: 5000000 },
})
const upload = multer({ storage }).single('file');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
const options = {
    signatureVersion: 'v4',
    region: 'ap-south-1', // same as your bucket
    endpoint: new AWS.Endpoint('https://sspanil.s3.amazonaws.com'),
    useAccelerateEndpoint: false,
    s3ForcePathStyle: true,
}

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/file.html');
});

//    key = ("" + Math.random()).substring(2, 8);

var s3 = new AWS.S3({
    //apiVersion: '2006-03-01',
    signatureVersion: 'v4',
});
var response;


//console.log(url);
app.post('/upload', upload, function(req, res) {
    console.log(req.file);
    var body = req.file.buffer;
    let myFile = req.file.originalname;
    const fileType = myFile[myFile.length - 1]
    const getSingedUrlforPut = async() => {
        //const params = {

        var params = {
                Bucket: 'sspanil',
                Key: `${myFile}`,
                Body: body,
                ACL: 'public-read',
                ContentType: 'pdf'
            }
            // console.log(params);

        // Bucket: 'sspanil',
        // Key: `${uuid}`,
        // //Body: body,
        // Expires: 60 * 5
        // };
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


    // var url = s3.getSignedUrl('putObject', params);
    // console.log(url);
    // res.send({ presignedUrl });


    // s3.upload(params, function(err, data) {
    //     if (err) {
    //         console.log("error")
    //     }
    //     res.status(200).send(data);
    // })
    // console.log(body);
    // fetch(url, { method: "PUT", body: body });
    //console.log(response);
    getSingedUrlforPut();
});

app.listen(port, () =>
    console.log(`App is listening on port ${port}.`)
)