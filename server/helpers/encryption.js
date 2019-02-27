const bcrypt = require('bcrypt');

let generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

let validatePassword = (password, hashedPw) => {
    if (password == null || hashedPw == null || password == undefined || hashedPw == undefined) {
        return console.log('password: ' + password + ' or hashedPw : ' + hashedPw + 'cannot be null'); 
    }
    return bcrypt.compareSync(password, hashedPw);
}

module.exports = { generateHash: generateHash, validatePassword: validatePassword };