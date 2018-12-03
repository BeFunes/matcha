const db = require('../util/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


module.exports = {
	createUser: async function ({userInput}) {
		console.log("CREATE USER")
		const [row] = await db.query('SELECT * FROM users WHERE email=?', userInput.email)
		if (row.length > 0) {
			throw new Error('User exists already!')
		}
		const hashedPw = await bcrypt.hash(userInput.password, 12);
		await db.query('Insert into users (email, password) VALUES (?, ?)', [userInput.email, hashedPw])
		// check return value and send error if appropriate
		// console.log(row)
		return {email: userInput.email}
	},
	login: async function ({email, password}) {
		const [user] = await db.query('SELECT * FROM users WHERE email=?', email)
		if (user.length === 0) {
			const error = new Error('User not found.')
			error.code = 401
			throw error
		}
		// console.log(password, user[0].password)
		const isEqual = await bcrypt.compare(password, user[0].password)
		if (!isEqual) {
			const error = new Error('Password is incorrect.')
			error.code = 401
			throw error
		}
		const token = jwt.sign(
			{userId: user[0].id, email: user[0].email},
			"👹",
			{expiresIn: '1h'}
		)
		return {token: token, userId: user[0].id}
	},
	insertProfileInfo: async function({info}, req) {
		console.log("INSERT PROFILE INFO");
		if (!req.isAuth) {
			const error = new Error('Not authenticated!');
			error.code = 401;
			throw error;
		}
		///////// ADD VALIDATION
		const query = `UPDATE users SET first_name = ?, last_name = ?, dob = ?, gender = ?, orientation = ? WHERE email = ?`;
		// req.userId  = 'david.david@hotmail.com'
		// const query = 'Insert into users (first_name, last_name, dob, gender, orientation) VALUES (?, ?, ?, ?, ?)'
		const [row] = await db.query(query, [info.firstName, info.lastName, info.dob, info.gender, info.orientation, req.email])

		console.log(row)
		return {content: "Data updated successfully"}
	}
};
