const db = require('../util/db');
const bcrypt = require('bcryptjs');


module.exports = {
    createUser: async function({ userInput }, req) {
        const [row] = await db.query('SELECT * FROM users WHERE email=?', userInput.email)
        if (row.length > 0) {
            throw new Error('NOt happy')
        }
        const hashedPw = await bcrypt.hash(userInput.password, 12);
        await db.query('Insert into users (email, password) VALUES (?, ?)', [userInput.email, hashedPw])
        console.log(row)
        return {email: userInput.email}
    }
};
