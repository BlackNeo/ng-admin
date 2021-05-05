const moongose = require('mongoose');
const express  = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Data = require('./data');

const API_PORT = 3001;
const app = express();
app.use(cors());

const router = express.Router();

// this is the Mongo DB database
const dbRoute = 'mongodb+srv://webo:1234@cluster0.r9dta.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

// connects the back end code with database
moongose.connect(dbRoute, {useNewUrlParser: true});

let db = moongose.connection;

db.once('open', () => console.log('connected to the database'));

// Checks if connection with database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error ; ')); 

// (optional) only made for logging and 
// bodyParser, parses the request body to be readeble json format

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(logger('dev'));

//this is the GET method
//this method fetch all available data in the database

router.get('/getData', (req, res) => {
    Data.find((err, data) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: data });
    });
});

// this is the DELETE method
// this method removes exising data from the database

router.delete('/deteteData', (req, res) => {
    Data.findByIdAndRemove(id, (err) => {
        if (err) return res.send(err);
        return res.json({ success: true});
    });
});

// this is the CREATE method
// this method adds nex data in our database

router.post('/putData',  (req, res) => {
    let data = new Data();

    const { id, message } = req.body;

    if (( !id && id !== 0) || message) {
        return res.json({
            success: false,
            error: 'INVALID INPUTS',
        });
    }
    data.message = message;
    data.id = id;
    data.save((err) => {
        if (err) return res.json({ success: false, error: err});
        return res.json({ success: true });
    });
});

// append /api for the http requests

app.use('/api', router);

// launch the backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
