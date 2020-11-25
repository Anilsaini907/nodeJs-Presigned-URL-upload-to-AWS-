var express = require('express');
var multiparty = require('multiparty');
const AWS = require('aws-sdk');
var morgan = require('morgan');
var bodyParser = require('body-parser');
const fetch = require("node-fetch");
const multer = require('multer');
const multerS3 = require('multer-s3');
var cors = require('cors')
var app = express();
app.use(morgan("default"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;
app.use(bodyParser.json())
var req = require('request');
var fs = require('fs');
const uuid = require('uuid');
const router = express.Router();
const axios = require('axios');
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
// const multipart = require('connect-multiparty');
// const multipartMiddleware = multipart({
//     uploadDir: './uploads'
// });

const storage = multer.memoryStorage({
    destination: function(req, file, cb) {
        cb(null, '')
    },
    filename: (req, file, cb) => {
            cb(null, file.fieldname + '-' + Date.now())
        }
        // limits: { fileSize: 5000000 },
});
const upload = multer({ storage }).single('file');
//     //limits: { fileSize: 2000000 },s
// }).array('file', 10);
var url;
var getfile;
app.post('/upload', upload, function(req, res) {
    // console.log(req.body, req.files);
    upload(req, res, (error) => {
        console.log('files', req.file);
        getfile = req.file;
        // for (index = 0, len = files.length; index < len; ++index) {
        //     result += `<img src="${files[index].path}" width="300" style="margin-right: 20px;">`;
        // }
        var body = req.file.buffer;
        var myFile = req.file.originalname;
        path = req.file.path;

        const getSingedUrlforPut = async() => {
            const params = {
                Bucket: 'sspanil',
                Key: `${myFile}`,
                // Body: body,
                Expires: 60 * 5 * 5
            };
            try {
                url = await new Promise((resolve, reject) => {
                    s3.getSignedUrl('putObject', params, (err, url) => {
                        err ? reject(err) : resolve(url);
                    });
                });
                url = JSON.stringify(url);
                // console.log(url)
            } catch (err) {
                if (err) {
                    console.log(err)
                }
            }
            postfile(url, getfile);
        };
        getSingedUrlforPut();
        async function postfile(url, getfile) {
            console.log("hii in post " + url);
            const config = {
                method: 'put',
                url: url,
                data: getfile,
                // mimeType: "multipart/form-data",
                // contentType: "csv/pdf/doc",
            }
            let res = await axios(config).then(function(response) {
                    console.log(JSON.stringify(response.data));
                })
                .catch(function(error) {
                    console.log(error);
                });
            //console.log(res.status);
        }

        // const postfile = (url, body) => {

        //     console.log("hii in post " + url);
        //     // url = "https://sspanil.s3.ap-south-1.amazonaws.com/Anil%20Saini%20Offer%20Letter%2023-Jul-18.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA5ZYC65IMKR3AN3MJ%2F20201122%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20201122T131051Z&X-Amz-Expires=1500&X-Amz-Signature=8b122c888e62519e85df30806ddbe24acb6069fd496025fe4050f0b03dc7b4d8&X-Amz-SignedHeaders=host"
        //     // console.log("body" + body);s
        //     url = `${url}`
        //     fetch(url, { method: 'PUT', body }).then(response => {
        //         console.log("in fetch")
        //         return response.json()
        //     });
        // }

    });
});


app.listen(port, () => {
    console.log(`App is listening on port ${port}.`)
});