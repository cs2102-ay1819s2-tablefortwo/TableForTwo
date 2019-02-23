let sqlQueries = {
    authUser: "SELECT * FROM Users WHERE username = $1 LIMIT 1", 
    findById: "SELECT * FROM Users WHERE id = $1",
    findByUsername: "SELECT * FROM Users WHERE username = $1",
    signupUser: "INSERT INTO Users(name, username, password) VALUES($1, $2, $3)"
};

module.exports = sqlQueries;