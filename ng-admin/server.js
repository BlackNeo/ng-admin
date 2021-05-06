const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require('cors');

require('dotenv').config();

const users = require("./routes/api/users");

const app = express();

app.use(cors());

// BodyParser middleware
app.use(bodyParser.urlencoded ({
    extended: false
    })
);

app.use(bodyParser.json());

//DB config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose.connect(
    db,
    { useNewUrlParser: true }
)
.then( () => console.log("MongoDB successfully connnected"))
.catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport") (passport);

// Routes
app.use("/api/users", users);

const port = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production') {
    // Exprees will serve up production assets
    app.use(express.static('client/build'));
    // Express serve up index.html file if it doesn't recognize route
    const path = require('path');
    app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Server up and running on port ${port} !`));