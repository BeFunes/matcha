const db = require('../util/database');
const bcrypt = require('bcryptjs');


module.exports = {
    createUser: async function({ userInput}, req) {
    const existingUser = db.execute('SELECT * FROM users WHERE email=?', userInput.email)
        .then(([rows, data]) => {
            console.log(rows, data)
            throw new Error ('Error')
        })
        .catch()
    }
};
