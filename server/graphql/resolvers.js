const db = require('../util/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


module.exports = {
    createUser: async function({ userInput }) {
        const [row] = await db.query('SELECT * FROM users WHERE email=?', userInput.email)
        if (row.length > 0) {
            throw new Error('User exists already!')
        }
        const hashedPw = await bcrypt.hash(userInput.password, 12);
        await db.query('Insert into users (email, password) VALUES (?, ?)', [userInput.email, hashedPw])
        console.log(row)
        return {email: userInput.email}
    },
    login: async function({email, password}) {
        const [user] = await db.query('SELECT * FROM users WHERE email=?', email)
        if (user.length === 0) {
            const error = new Error('User not found.')
            error.code = 401
            throw error
        }
        const isEqual = await bcrypt.compare(password, user[0].password)
        if (!isEqual) {
            const error = new Error ('Password is incorrect.')
            error.code = 401
            throw error
        }
        const token = jwt.sign(
            {userId: user[0].id, email: user[0].email},
            "👹",
            { expiresIn: '1h'}
        )
        return {token: token, userId: user[0].id}
    }
};
