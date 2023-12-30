const express = require ('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const database = require('./config/config');
const dotenv = require('dotenv');
dotenv.config();
const cookie = require('cookie-parser');

// import defined routes 
const apiRouter = require('./src/Routes/routes');


// express instance
const app = express();


// define port to running server 
const port = process.env.PORT || 3030;

// handle json data and url encoded data with limit
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// static server storage
app.use('/uploads/blogs', express.static('uploads/blogs'));


//enable cors
app.use(cors('*'));
// enable cors
const corsOptions = {
    origin: 'https://blog-frontend-delta-one.vercel.app/', // Update with your frontend domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // enable set cookie
  };

// parse json data
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
// cookie parser 
app.use(cookie());


// using routes 
app.use('/api',apiRouter);

//default route
app.get('/', (req, res) => {
    res.send('Hello World! Write-Wave');
});



// port listner
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
   
});
