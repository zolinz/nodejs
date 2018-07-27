const express = require('express');

const bodyParser = require('body-parser');


var app = express();

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.engine('json', require('ejs').renderFile);
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/helloß', (req, res) => {
  // res.send('<h1>Hello Express!</h1>');
  res.send({
    name: 'Andrew',
    likes: [
      'Biking',
      'Cities'
    ]
  });
});

app.get('/', (req, res) => {
  res.render('location.json');
});

// /bad - send back json with errorMessage
app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  });
});


app.get('/system/navigate/v1/location', (req, res) => {
    console.log("got the request:")
    console.log(req.originalUrl);
    console.log(  JSON.stringify(req.headers, undefined, 2));


    if (req.query.filter === '{\'Cohorts.Course.code\':\'myProgramCode01\',\'Cohorts.StartStudyPeriod.code\':\'myStudyPeriod01\',\'Cohorts.Entity.code\':\'myCollageCode01\'}'){
        console.log('got to filter');
        res.send('[]');
        //res.render('location.json');
    }else if (req.query.filter === '{\'Cohorts.Entity.code\':\'myCollageCode01\'}'){
        console.log('got to filter');
        //res.send('[]');
        res.render('location.json');
    }
    else{
        res.render('location.json');
    }
    //res.render('location.json');
});

app.listen(3000, () => {
  console.log('Server is up on port 3000');
});
