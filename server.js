
const PORT = process.env.PORT || 5000;
var express = require("express");
var cookieParser = require('cookie-parser');
var cors = require("cors");
var morgan = require("morgan");
var jwt = require('jsonwebtoken');
var http = require("http");
var path = require('path');
var moment = require('moment');
const multer = require('multer');
const fs = require('fs');
const admin = require("firebase-admin");

const { userModel, dashboardModel } = require("./dbrepo/models");

const { SERVER_SECRET } = require("./core/index");

const authRoutes = require("./routes/auth");
const { CLIENT_RENEG_LIMIT } = require("tls");

var app = express();

var server = http.createServer(app);

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, `${new Date().getTime()}-${file.filename}.${file.mimetype.split("/")[1]}`)
    }
})
var upload = multer({ storage: storage })

var SERVICE_ACCOUNT = {
    "type": "service_account",
    "project_id": "maintenance-app-a8753",
    "private_key_id": "4b4830f35599fd34da1da214cf29993178d59717",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC9KgKULkag/vwV\nWA5wUaRVCM0MOH5irrd5rxE7/5teF+/DNhRhro1/k03m9BLmiClZiXNJc1zH/igA\nSo66zB2GxX4SoBmUWK3lj6oLZIlUg0I9E6usoRI15o1mpZXDE5RZF7PUXWJDvglG\npyTmSLyZiLU+wnXSi3Hrc30omYgYr0hDEwtnbv16Ot3WVH2xYcQS23Fae/dFS//j\nPM7kT3vjWpW9L+1i55zaCvN/ngtxbmKXb+g6nrBTe/DF4MstgBQCnnTeCna2jSE1\nRAfMCKiN7wNUTeYurtiu2Jo1/uG9LlNHUXHXQdWiFJG27yxZtObru6mTcHiT97GM\nK6OpJuD3AgMBAAECggEAQvJNO1gtUukrGfqyEXozaIzW1M5hnFctQ/l7ZfqOZ/yc\ntD+9ctyt40qktWoIDmJ+D9wfWw1i9ryyN3grj1yRzpKyjbDvnJrN4IK5sZKBL9HM\nbYU6qrvOkBjqTjuoBwQ06lsDH9N05XiqG8EnxABWDxhc3LtBq6QCS0vyLZ44llNG\nkZ+tspQlfn9s2xtz/MngqL14LvkC9Ivfoxf5MlYcxqQdExKDjkVcS8E24qCL4c5p\nmjvi4Jm+PMC7q9hFJUCbReNfXeGqFb+kuvuXqM/mCgMY4d4SBQhI1MANY42vhc+C\nBQpp5pISSKcYghM/g/sqpFOHdhzUTM17Hrq2y8nn0QKBgQDnNqNql+MfdaCwy0D7\nfoSHv/3l3U2kCbSqZ+vjO6i55DM2p7GmMlKu0pK7A5Ad1TXsa8Oy+6JNqerspX03\njTkgoC3kuuFcrZYx+y4a5l8caETwg0Af5IUDVawZxdIzQW0Qkcc235fccPdCzP5P\n1SGbuWh7E+8/XbbJ//h+iJEI1QKBgQDRcWF8XNN0YjBQHTIzzxDrJfbPaGrmGbgt\n0y13JS6ox3MXN8H5Y9Q71IEtB5KXYfZVGHkuYBz1V9XXHCETqhpl8lZeXgAQtDNp\n7t+oo0Q8xIBMYHC8kI5ikhg8UfFESaf3Ak+W8RYE/mpySV9T3LCfxS+T2MsrSXBY\nBAuGtsBomwKBgQDPeT/6joDH4g1nl3ugMU9LYQS8F3FsGSl9H/OT3Bzzccpi6OeI\ncu+u4FW6auAPZRsWIz1ghlyFxEuCPp22E4uHszR7YxaGy11TTEl66e2+1/HEwIHy\nHGUfMOlV1yVfyP3NOILCwrDKprO5xakOifm2exE+IA03lyhG6uJY6ML8YQKBgG1i\nvftpr7Z1Ia510SZl2vw1E7Y3Xr1WaW7lgDVd4gScRmu130UU8l9dGSofblxJ+ZFv\n+rpR0E4C1dhHBK90g90CuEEI7xfKRZ/p9j3pJ1ZlemxpYffZt8ObcbTvRwbXQTYs\nqsy2lT1+crHFyFfQRx7qqXKaI2I0NMyDMFHnWI5JAoGAUqtGWfQYbn4nl4YhxBEY\nQJyeTQGCAeOP/YFwfV5rs53Mro2ckiSlwlR3M27Qbuyj/tzJwTu4x/7Sw3Krmqa8\npG9hLH7AeC7NxLsbg4GqHZprHlhysMZs0fEWqAUZlrfNNLuf8X5ydwBGaF6UmaaD\n2gSh4QN/Pd9b+8U7YLqWfIY=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-e574q@maintenance-app-a8753.iam.gserviceaccount.com",
    "client_id": "115058985041593282937",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-e574q%40maintenance-app-a8753.iam.gserviceaccount.com"
}

admin.initializeApp({
    credential: admin.credential.cert(SERVICE_ACCOUNT),
    databaseURL: "https://maintenance-app-a8753-default-rtdb.firebaseio.com"
});

const bucket = admin.storage().bucket("gs://maintenance-app-a8753.appspot.com");

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(morgan('dev'));

app.use("/", express.static(path.resolve(path.join(__dirname, "front-end/build"))))

app.use('/auth', authRoutes);

app.use(function (req, res, next) {

    console.log("req.cookies: ", req.cookies);

    if (!req.cookies.jToken) {
        res.status(401).send("include http-only credentials with every request")
        return;
    }
    jwt.verify(req.cookies.jToken, SERVER_SECRET, function (err, decodedData) {
        if (!err) {

            const issueDate = decodedData.iat * 1000;
            const nowDate = new Date().getTime();
            const diff = nowDate - issueDate; // 84600,000

            if (diff > 3000000000) { // expire after 5 min (in milis)
                res.send({
                    message: "TOKEN EXPIRED",
                    status: 401
                });
            } else { // issue new Token
                var token = jwt.sign({
                    id: decodedData.id,
                    name: decodedData.name,
                    email: decodedData.email,
                    phone: decodedData.phone,
                    role: decodedData.role
                }, SERVER_SECRET)

                res.cookie('jToken', token, {
                    maxAge: 86_400_000,
                    httpOnly: true
                });
                req.body.jToken = decodedData
                req.headers.jToken = decodedData

                next();
            }
        } else {
            res.send({
                message: "Invalid Token",
                status: 401
            });
        }
    });
});

app.get("/profile", (req, res, next) => {
    userModel.findById(req.body.jToken.id, 'name email phone createdOn role profilePic', function (err, doc) {
        if (!err) {
            res.send({
                profile: doc,
                status: 200
            });
        } else {
            res.send({
                message: "Server Error",
                status: 500
            });
        }
    });
});

app.post("/uploadfile", upload.any(), (req, res, next) => {
    bucket.upload(
        req.files[0].path,
        function (err, file, apiResponse) {
            if (!err) {
                file.getSignedUrl({
                    action: 'read',
                    expires: '03-09-2491'
                }).then((urlData, err) => {
                    if (!err) {
                        console.log("public downloadable url: ", urlData[0])
                        userModel.findOne({ email: req.body.email }, (err, user) => {
                            console.log("Yaha check karna han kia a arha han", user)
                            if (!err) {
                                userModel.updateOne({ profilePic: urlData[0] }, (err, updatedProfile) => {
                                    if (!err) {
                                        res.status(200).send({
                                            message: "succesfully uploaded",
                                            url: urlData[0],
                                        });
                                    }
                                    else {
                                        res.status(500).send({
                                            message: "an error occured" + err,
                                        });
                                    }

                                });
                            }
                            else {
                                res.send({
                                    message: "error"
                                });
                            }
                        })
                        try {
                            fs.unlinkSync(req.files[0].path)
                        } catch (err) {
                            console.error(err)
                        }
                    }
                });
            } else {
                console.log("err: ", err)
                res.status(500).send();
            }
        }
    );
});

app.post("/dashboard", (req, res, next) => {
    if (!req.body.meterReading || !req.body.fuelPricePerLiter || !req.body.fuelRupees || !req.body.fuelInLiters || !req.body.ofDates) {
        res.send({
            status: 303,
            message: ` please send in json body.
            e.g:
            {
                "meterReading": "xxxxxxxxxxxxxxx",
                "fuelPricePerLiter": "xxxxxxxxxxxxx",
                "fuelRupees": "xxxxxxxxxxxxxx",
                "fuelInLiters": "xxxxxxxxxxxxxxx",
            }`
        })
    }
    userModel.findById(req.body.jToken.id, 'email', function (err, user) {
        if (!err) {
            dashboardModel.create({
                "meterReading": req.body.meterReading,
                "fuelPricePerLiter": req.body.fuelPricePerLiter,
                "fuelRupees": req.body.fuelRupees,
                "fuelInLiters": req.body.fuelInLiters,
                "email": user.email,
                "ofDates": moment(req.body.ofDates).format("L")
            }, function (err, data) {
                if (err) {
                    res.send({
                        message: "DB ERROR",
                        status: 404
                    });
                }
                else if (data) {
                    res.send({
                        status: 200,
                        data: data
                    });
                } else {
                    res.send({
                        message: "err",
                        status: 500
                    });
                }
            });
        }
        else {
            res.send({
                message: JSON.stringify(err),
                status: 404
            });
        }
    });
});

app.get('/getdata', (req, res, next) => {
    userModel.findById(req.body.jToken.id, 'email', function (err, user) {
        if (!err) {
            dashboardModel.find({ email: req.body.jToken.email })
                .sort({ _id: -1 })
                // .limit(100)
                .exec((err, data) => {
                    if (!err) {
                        res.send({
                            data: data,
                            status: 200
                        });
                    } else {
                        res.send({
                            message: err,
                            status: 303
                        });
                    }
                });
        }
    });
});

app.post("/delete", (req, res, next) => {
    userModel.findById(req.body.jToken.id, 'email', function (err, user) {
        if (!err) {
            dashboardModel.deleteOne({ _id: req.body.id }, (err, data) => {
                if (!err) {
                    res.send({
                        message: "Delete Data",
                        status: 200
                    });
                } else {
                    res.send({
                        message: "DB ERR",
                        status: 404
                    });
                }
            });
        } else {
            res.send({
                message: err,
                status: 303
            });
        }
    });
});

app.post("/upload", upload.any(), (req, res, next) => {

    console.log("req.body: ", req.body);
    console.log("req.body: ", JSON.parse(req.body.myDetails));
    console.log("req.files: ", req.files);

    console.log("uploaded file name: ", req.files[0].originalname);
    console.log("file type: ", req.files[0].mimetype);
    console.log("file name in server folders: ", req.files[0].filename);
    console.log("file path in server folders: ", req.files[0].path);

    let fileOnePromise = new Promise((resolve, reject) => {
        bucket.upload(
            req.files[0].path,
            function (err, file, apiResponse) {
                if (!err) {
                    file.getSignedUrl({
                        action: 'read',
                        expires: '03-09-2491'
                    }).then((urlData, err) => {
                        if (!err) {
                            console.log("public downloadable url: ", urlData[0]) // this is public downloadable url 
                            resolve(urlData[0]);
                            try {
                                fs.unlinkSync(req.files[1].path)
                                return;
                            } catch (err) {
                                console.error(err)
                            }
                        }
                    })
                } else {
                    console.log("err: ", err)
                    res.status(500).send();
                }
            });
    })
    let fileTwoPromise = new Promise((resolve, reject) => {
        bucket.upload(
            req.files[1].path,
            function (err, file, apiResponse) {
                if (!err) {
                    file.getSignedUrl({
                        action: 'read',
                        expires: '03-09-2491'
                    }).then((urlData, err) => {
                        if (!err) {
                            console.log("public downloadable url: ", urlData[0]) // this is public downloadable url 
                            resolve(urlData[0]);
                            try {
                                fs.unlinkSync(req.files[0].path)
                                return;
                            } catch (err) {
                                console.error(err)
                            }
                        }
                    })
                } else {
                    console.log("err: ", err)
                    res.status(500).send();
                }
            });
    })

    Promise.all([fileOnePromise, fileTwoPromise]).then((respArray) => {
        console.log("respArray: ", respArray)
        if (!respArray) {
            res.send({
                message: "Please Required Both Photo",
                status: 303
            });
        }
        userModel.findOne({ email: req.headers.jToken.email }, (err, user) => {
            if (!err) {
                dashboardModel.create({
                    "meterReadingImage": respArray[0],
                    "fuelReadingImage": respArray[1],
                    "email": user.email,
                    "status": "In Process"
                }, function (err, dataphoto) {
                    if (!err) {
                        res.send({
                            photoUrls: respArray,
                            status: 200,
                            message: "Photos Upload"
                        });
                    } else {
                        res.send({
                            message: "Error" + err,
                            status: 404
                        });
                    }
                });
            } else {
                res.send({
                    message: "Error " + err,
                    status: 404
                });
            }
        });
    });
});

app.get('/adminGetPhotoData', (req, res, next) => {
    dashboardModel.find({ status: 'In Process' }, (err, data) => {
        if (!err) {
            res.send({
                data: data,
                status: 200
            });
        }
        else {
            res.send({
                message: 'error' + err,
                status: 404
            });
        }
    });
});

app.get('/adminHistory', (req, res, next) => {
    dashboardModel.find({ status: 'Process Complete' }, (err, data) => {
        if (!err) {
            res.send({
                data: data,
                status: 200
            });
        }
        else {
            res.send({
                message: 'error' + err,
                status: 404
            });
        }
    });
});

app.post("/updateStatus", (req, res, next) => {
    if (!req.body.meterReading || !req.body.fuelRate || !req.body.fuelTotalRupees || !req.body.fuelInLiters) {
        res.send({
            message: "Please Provide Full Requiment",
            status: 303
        })
        return;
    }
    dashboardModel.updateOne(
        { _id: req.body.id },
        {
            meterReading: req.body.meterReading,
            fuelPricePerLiter: req.body.fuelRate,
            fuelRupees: req.body.fuelTotalRupees,
            fuelInLiters: req.body.fuelInLiters,
            status: req.body.status
        },
        (err, raw) => {
            if (!err) {
                res.send({
                    message: "Beta Done",
                    status: 200
                });
            } else {
                res.send({
                    message: "Err" + err,
                    status: 404
                });
            }
        });
});

server.listen(PORT, () => {
    console.log("Server is Running:", PORT);
});