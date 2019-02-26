const bcrypt = require('bcrypt');

let generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

let validatePassword = (password, hashedPw) => {
    return bcrypt.compareSync(password, hashedPw);
}

module.exports = { generateHash: generateHash, validatePassword: validatePassword };