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



const trylogin = () => {
    const s3 = new AWS.S3();
    AWS.config.update({accessKeyId: 'key', secretAccessKey: 'secretkey'});

    // Tried with and without this. Since s3 is not region-specific, I don't
    // think it should be necessary.
     AWS.config.update({region: 'ap-southeast-2'})

    const myBucket = 'np-zoli-log-bodies2';
    const myKey = '06-21/zoli-D80621-T015423Z-859zolidpn038542a145-I0156';
    const signedUrlExpireSeconds = 60 * 5;

    const myurl = s3.getSignedUrl('getObject', {
        Bucket: myBucket,
        Key: myKey,
        Expires: signedUrlExpireSeconds
    });

    console.log(myurl)

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

app.get('/mybucket/*', (req, res) =>{
    sess = req.session;

    url = req.originalUrl;

    if(sess.email){
        console.log('got to root / ');
        res.redirect('https://www.google.com' + url);
    }else{
        console.log(url);
        res.render('index.html');
    }
    sess.email;
    sess.username;
});


app.get('/testpage', (req, res) =>{

        res.render('testpage.html');

});



let psw;

app.post('/login', (req,res) => {
    mysession = req.session;
    //In this we are assigning email to sess.email variable.
    //email comes from HTML page.
    mysession.email=req.body.email;
    console.log('your password: ' + req.body.pass);
    mysession.psw = req.body.pass;
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



app.listen(3000, () => {

    trylogin();
    console.log('server is up');
    trylogin();
    trylogin();
    trylogin();
});


