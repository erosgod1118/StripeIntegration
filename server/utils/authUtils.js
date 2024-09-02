const jwt = require("jsonwebtoken");

module.exports.issueToken = function(user) {
    var token = jwt.sign({ ...user, iss: "Stripe Integration" }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE_TIME,
    });

    return token;
};

module.exports.Roles = {
    User: ["user"],
    Admin: ["admin"],
    All: ["user", "admin"],
}