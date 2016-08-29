/**
 * Module dependencies.
 */
/*  require('connect')-   used for connecting middleware in nex express 4
    require('jwt-simple') - for making authentification tokens
    require('cookie-parser') - for making cookies for login
    require('method-override') -request headers
    // NOTE: when using req.body, you must fully parse the request body 
    //       before you call methodOverride() in your middleware stack, 
    //       otherwise req.body will not be populated

*/
/**
 * Module dependencies.
 */
/*  require('connect')-   used for connecting middleware in nex express 4
    require('jwt-simple') - for making authentification tokens
    require('cookie-parser') - for making cookies for login
    require('method-override') -request headers
    // NOTE: when using req.body, you must fully parse the request body 
    //       before you call methodOverride() in your middleware stack, 
    //       otherwise req.body will not be populated

*/
var express = require('express');
var http = require('http');
var path = require('path');
var ejs = require('ejs');
var jwt = require('jwt-simple');
var _ = require('underscore');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var errorhandler = require('errorhandler');
var connect = require('connect');
var methodOverride = require('method-override');
var favicon = require('serve-favicon');
//nodemailer working app
var nodemailer = require('nodemailer');
var app = express();
//database links
var todos = require('./routes/todos');
var images = require('./routes/images');
//require mongodbapp
var mongoose = require('mongoose');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));
app.use(cookieParser());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
//aquire database
app.use('/todos', todos);
app.use('/images', images);
//define engine
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
/*make a token for authentification*/
var connect = connect();
app.set('port', process.env.PORT || 3000);
app.set('jwtTokenSecret', '123456ABCDEF');
var tokens = [];
/*request headers and searches for all pairs of tokens with function _.where(tokens, token)*/
function requiresAuthentication(request, response, next) {
        //console.log(request.headers);
        if (request.headers.access_token) {
            var token = request.headers.access_token;
            if (_.where(tokens, token).length > 0) {
                var decodedToken = jwt.decode(token, app.get('jwtTokenSecret'));
                if (new Date(decodedToken.expires) > new Date()) {
                    next();
                    return;
                } else {
                    removeFromTokens();
                    response.status(401).end("Your session is expired");
                }
            }
        }
        response.redirect('/');
        response.status(401).end("No access token found in request");
    }
    /*using when logout to remove  token*/

function removeFromTokens(token) {
        for (var counter = 0; counter < tokens.length; counter++) {
            if (tokens[counter] === token) {
                tokens.splice(counter, 1);
                break;
            }
        }
    }
    // development only
if ('development' == app.get('env')) {
    connect.use(errorhandler());
}
/*return a homepage where we have some route controllers inside SystemApp*/
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname + "/Home.html"));
});
/*for login you must send equest which then checks a username and password.as a response you get a token which expires in few days*/
app.post('/api/login', function(request, response) {
    var userName = request.body.userName;
    var password = request.body.password;
    if (userName === "test" && password === "test") {
        var expires = new Date();
        expires.setDate((new Date()).getDate() + 5);
        var token = jwt.encode({
            userName: userName,
            expires: expires
        }, app.get('jwtTokenSecret'));
        tokens.push(token);
        response.status(200).send({
            access_token: token,
            userName: userName
        });
    } else {
        response.status(401).send("Invalid credentials");
    }
});
/*after logout token is removed*/
app.post('/api/logout', requiresAuthentication, function(request, response) {
    var token = request.headers.access_token;
    removeFromTokens(token);
    response.send(200);
});
//setup email
app.post('/mail/send', function(request, response) {
    var mailOptions = request.body;
    console.log(mailOptions.to + ' ' + mailOptions.from + ' ' +
        mailOptions.html);
    var transporter = nodemailer.createTransport(
        'smtps://freakydevelopercat%40gmail.com:saghrjcqrbtxeztz@smtp.gmail.com'
    );
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    })
});
//image upload
var multer=require('multer');

app.use(function(req, res, next) { //allow cross origin requests
        res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
        res.header("Access-Control-Allow-Origin", "http://localhost");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    /** Serving from the same express Server
    No cors required */
    app.use(express.static(__dirname +'/public/uploads/')); 

    var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './public/uploads/');
        },
        filename: function (req, file, cb) {
            cb(null,  file.originalname );
        }
    });

    var upload = multer({ //multer settings
                    storage: storage
                }).single('file');

    /** API path that will upload the files */
    app.post('/upload', function(req, res) {
        upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
             res.json({error_code:0,err_desc:null});
        });
    });

/*the server is listening on port*/
http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});