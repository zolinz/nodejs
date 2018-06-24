const express = require('express');
const hbs = require('hbs');
const session = require('express-session');
const bodyParser = require('body-parser');

const AWS = require('aws-sdk')

var app = express();

//app.set('view engine', hbs);

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
//app.use(express.static(__dirname + '/public'));
app.use(session({secret: 'ssshhhhh'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


//function myCallback(err, result)

const trylogin = (accessKey, secretKey, bucketName, key) => {
    const s3 = new AWS.S3();
    AWS.config.update({accessKeyId: accessKey, secretAccessKey: secretKey});

     AWS.config.update({region: 'ap-southeast-2'})

    const signedUrlExpireSeconds = 60 * 5;

     let params = { Bucket: bucketName,
         Key: key,
         Expires: signedUrlExpireSeconds
     };

     let myUrl = s3.getSignedUrl('getObject', params);

   /*s3.getSignedUrl('getObject', params, (err, url) => {
       res.redirect(url);
    });*/

   return myUrl;
}



/*app.get( '/', (req, resp) => {
    console.log(req.originalUrl);
    resp.send({
        name: 'zolika',
        address: 'Truganina'
    });
});*/

/*app.get('/about', (req, resp) => {
    console.log(req.originalUrl);
    resp.render('about.hbs');
});

app.get('/bad', (req, resp)=> {
    resp.send('this is bad');
})*/

let mysession;
let url;

let bucketname;
let key;

app.get('/logviewer', (req, res) =>{
    mysession = req.session;

    url = req.originalUrl;
    debugger;

    bucketname = req.param('bucketname');
    key = req.param('key');

    console.log(bucketname, key);

    if(mysession.accesskey){
        console.log('got to root / ');
        let url = trylogin(mysession.accesskey, mysession.secretaccesskey, bucketname, key);

        res.redirect(url);
    }else{
        console.log(url);

        res.header("Access-Control-Allow-Origin", "http://10.0.0.125:3000");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        res.render('index.html');
    }

});


app.get('/testpage', (req, res) =>{
        res.render('testpage.html');
});



let psw;

app.post('/login', (req,res) => {
    mysession = req.session;
    //In this we are assigning email to sess.email variable.
    //email comes from HTML page.
    mysession.accesskey = req.body.accesskey;
    mysession.secretaccesskey = req.body.secretaccesskey;

    //console.log('your password: ' + req.body.secretaccesskey);

    // do aws magic here

    let myurl = trylogin(req.body.accesskey, req.body.secretaccesskey, bucketname, key);
    url = trylogin(req.body.accesskey, req.body.secretaccesskey, bucketname, key);

    //console.log('login received url: ' + url);
    res.header("Access-Control-Allow-Origin", "http://10.0.0.125:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    //res.redirect(url);
    res.end(url);
});

app.get('/admin',(req,res) => {
    mysession = req.session;
    if(mysession.email) {
        res.write(' <h1>Hello '+mysession.email+'</h1>');
        res.write(' <h1> your password ' + mysession.psw + '</h1>');
        res.end('<a href="/logout">Logout</a>');
    } else {
        res.write(' <h1>Please login first.</h1>');
        res.end('<a href="/index.html">Login</a>');
    }
});

app.get('/logout',(req,res) => {
    console.log('got to logout ');
    req.session.destroy( (err) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});



app.listen(8080, () => {

    //trylogin();
    console.log('server is up');
    //trylogin();
    //trylogin();
    //trylogin();
});


