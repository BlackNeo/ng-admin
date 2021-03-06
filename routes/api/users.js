const express = require("express");
const router  = express.Router();
const bcrypt  = require("bcryptjs");
const jwt     = require("jsonwebtoken");
const keys    = require("../../config/keys");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput    = require("../../validation/login");

// Load User model
const User = require("../../models/User");

// REGISTER ROUTE
// ==============================
// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
    // Form validation
    const { errors, isValid } = validateRegisterInput(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ email: "Email already exists "});
        } else {
            const newUser = new User ( {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });
            // Hash password before saving in DB
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                           .then(user => res.json(user))
                           .catch(err = console.log(err));
                });
            });
        }
    });
});

// LOGIN ROUTE
// =========================
// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public

router.post("/login", (req, res) => {
    // Form validation
    const { errors, isValid } = validateLoginInput(req.body);

    // Check validation 
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email    = req.body.email;
    const password = req.body.password;

    // Find user by email
    User.findOne({ email }).then(user => {
        // Check if user exists
        if (!user) {
            return res.status(400).json({ emailnotfound: "Email not found"});
        }
        // Check password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // User matched, create JWT payload
                const payload = {
                    id: user.id,
                    name: user.name
                };
                //Sign token
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn: 31556926 // One year in second
                    },
                    (err, token) => {
                        res.json({
                            sucess: true,
                            token: "Bearer " + token
                        });
                    }
                );
            } else {
                return res.status(400).json({passwordisincorrect: "Password is incorrect"});
            }
        });
    });
});

// Router exports

module.exports = router;