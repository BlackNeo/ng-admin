const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
    let errors = {};

    // Convert empty field to empty field to use validator functions
    data.name      = !isEmpty(data.name) ? data.name : "";
    data.email     = !isEmpty(data.email) ? data.email : "";
    data.password  = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";

    // Name check
    if (Validator.isEmpty(data.name)) {
        errors.name = "Name field is required";
    }

    // Email check
    if (Validator.isEmpty(data.email)) {
        errors.email = "Email fiel is required";
    } else if (!Validator.isEmail (data.email)) {
        errors.email = "Email field is invalid";
    }

    // Passwords check
    if (Validator.isEmpty(data.password)) {
        errors.password = "Password field is required";
    }

    if (Validator.isEmpty(data.password2)) {
        errors.password2 = "Confirm password field is required";
    }

    if (!Validator.isLength(data.password, {min: 6, max: 30})) {
        errors.password = "Password must be at least 6 characters, max 30";
    }

    if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = "Confirm password must match";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
 };