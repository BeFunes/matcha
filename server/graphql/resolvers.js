const db = require('../util/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validate } = require('./../util/validator')

module.exports = {
	createUser: async function ({userInput}) {
		console.log("CREATE USER")
		if (!validate(userInput.email, "email") || !validate(userInput.password, "password")) {
			const error = new Error('Validation Error')
			error.code = 422
			throw error
		}
		const [row] = await db.query('SELECT * FROM users WHERE email=?', userInput.email)
		if (row.length > 0) {
			throw new Error('User exists already!')
		}
		const hashedPw = await bcrypt.hash(userInput.password, 12)
		await db.query('Insert into users (email, password) VALUES (?, ?)', [userInput.email, hashedPw])
		// check return value and send error if appropriate
		// console.log(row)
		return {email: userInput.email}
	},

	login: async function ({email, password}) {
		console.log("LOGIN")
		if (!validate(email, "email") || !validate(password, "password")) {
			const error = new Error('Validation Error')
			error.code = 422
			throw error
		}
		const [user] = await db.query('SELECT isOnboarded, password, id, email FROM users WHERE email=?', email)
		if (user.length === 0) {
			const error = new Error('User not found.')
			error.code = 401
			throw error
		}
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
		return {token: token, userId: user[0].id, isOnboarded: !!user[0].isOnboarded}
	},

	insertProfileInfo: async function({info}, req) {
		console.log("INSERT PROFILE INFO")
		if (!req.isAuth) {
			const error = new Error('Not authenticated!')
			error.code = 401
			throw error
		}
		if (!validate(info.firstName, "firstName") || !validate(info.lastName, "lastName")
			|| !validate(info.gender, "gender") || !validate(info.orientation, "orientation")
			|| !validate(info.dob, "dob")) {
			const error = new Error('Validation Error')
			error.code = 422
			throw error
		}
		const query = `UPDATE users SET first_name = ?, last_name = ?, dob = ?, gender = ?, orientation = ? WHERE email = ?`
		const [row] = await db.query(query, [info.firstName, info.lastName, info.dob, info.gender, info.orientation, req.email])
		console.log(row)
		return {content: "Profile data updated successfully"}
	},

	insertBioInfo: async function({info}, req) {
		console.log("INSERT BIO INFO")
		if (!req.isAuth) {
			const error = new Error('Not authenticated!')
			error.code = 401
			throw error
		}
		if (!validate(info.job, "job"), !validate(info.bio, "bio"), !validate(info.interests, "tags")) {
			const error = new Error('Validation Error')
			error.code = 422
			throw error
		}
		const query = `UPDATE users SET job = ?, bio = ? WHERE email = ?`
		const [row] = await db.query(query, [info.job, info.bio, req.email])
		console.log(`Update job=${info.job} and bio=${info.bio}\n`, row)
		const interestQuery = `INSERT INTO interests (title, user_id) values (?, ?)`
		info.interests.forEach(async (tag) => {
			const [row] = await db.query(interestQuery, [tag, req.userId])
			console.log(`insert new interest ${tag} for user ${req.userId}\n`, row)
		})
		return {content: "Bio data updated successfully"}
	},

	markOnboarded: async function(_, req) {
		console.log("MARK ONBOARDED")
		if (!req.isAuth) {
			const error = new Error('Not authenticated!')
			error.code = 401
			throw error
		}
		const query = `UPDATE users SET isOnboarded = ? WHERE email = ?`
		const [row] = await db.query(query, [1, req.email])
		console.log(`User ${req.email} marked onboarded\n`, row)
		return {content: "User successfully marked onboarded!"}
	},

	getUserData: async function (_, req) {
		console.log("GET USER INFO")
		if (!req.isAuth) {
			const error = new Error('Not authenticated!')
			error.code = 401
			throw error
		}
		const [user] = await db.query('SELECT * FROM users WHERE email= ? ', req.email)
		if (user.length === 0) {
			const error = new Error('User not found.')
			error.code = 401
			throw error
		}
		const data = {
			firstName: user[0].first_name,
			lastName: user[0].last_name,
			password: user[0].password,
			email: user[0].email,
			dob: user[0].dob,
			gender: user[0].gender,
			orientation: user[0].orientation,
			job: user[0].job,
			bio: user[0].bio,
			profilePic: user[0].profilePic,
			picture2: user[0].picture2,
			picture3: user[0].picture3,
			picture4: user[0].picture4,
			picture5: user[0].picture5,
		}
		return data
	}
}