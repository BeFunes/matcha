const db = require('../util/database');
const bcrypt = require('bcryptjs');


module.exports = {
    createUser: async function({ userInput}, req) {
        const [row, column] = await db.execute('SELECT * FROM users WHERE email=?', userInput.email)
        console.log(row, column)
        return {id: '1', email: 'someemail@you.com', password: 'pw'}
    }
};
