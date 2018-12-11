const db = require('../util/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validate } = require('./../util/validator')
const nodemailer = require('nodemailer');
const sendGripTransport = require('nodemailer-sendgrid-transport')
const hashToken = require('../../fakerUtils')

const transporter = nodemailer.createTransport(sendGripTransport({
	auth: {
		api_key: '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'
	}
}))

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
		const mailToken = hashToken.generateHashToken()
		await db.query('Insert into users (email, password, hashToken) VALUES (?, ?, ?)', [userInput.email, hashedPw, mailToken])
		const address = "localhost:3000/confirmation/"
		const hash = "ewfefewrfregtdghdfdsghbfsbfzdgadfxdfvsfdzvbsvdfbsdb"

		transporter.sendMail({
			to: userInput.email,
			from: 'raghirelli@gmail.com',
			subject: 'Confirmation',
			html: `<a href="http://localhost:3000/confirmation/${mailToken}" target="_blank" rel="noopener noreferrer" data-auth="NotApplicable" style="font-size:20px; font-family:Helvetica,Arial,sans-serif; color:#ffffff; text-decoration:none; text-decoration:none; -webkit-border-radius:7px; -moz-border-radius:7px; border-radius:7px; padding:12px 18px; border:1px solid #85b5ff; display:inline-block">Cliquez ici pour commencer ▸</a>`
		})
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
		console.log(req)
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
			isOnboarded: user[0].isOnboarded
		}
		return data
	},
	isOnboarded: async function(_, req) {
		console.log("GET IS ONBOARDED")
		if (!req.isAuth) {
			const error = new Error('Not authenticated!')
			error.code = 401
			throw error
		}
		// req.email = "david.baron@hotmail.com"
		const [user] = await db.query('SELECT isOnboarded FROM users WHERE email= ? ', req.email)
		if (user.length === 0) {
			const error = new Error('User not found.')
			error.code = 401
			throw error
		}
		return user[0].isOnboarded
	},
	match: async function({filters}, req) {
		console.log("MATCH")
		const today = new Date()
		const maxDob = `${today.getFullYear() - filters.minAge}-${("0" + (today.getMonth() + 1)).slice(-2)}-${("0" + today.getDate()).slice(-2)}`
		const minDob = `${today.getFullYear() - filters.maxAge}-${("0" + (today.getMonth() + 1)).slice(-2)}-${("0" + today.getDate()).slice(-2)}`
		let interestsCondition = ''
		filters.interests.forEach(() => {
			interestsCondition += 'AND I.title = ? '
		})

		const query = `
		SELECT R.*, GROUP_CONCAT(I.title) interests FROM 
			( SELECT U.*
				FROM users_interests UI
				JOIN users U ON UI.user_id = U.id
				JOIN interests I ON I.id = UI.interest_id
				WHERE (U.gender REGEXP ?)
				AND (U.dob > ?)
				AND (U.dob < ?)
				AND (U.orientation LIKE ?) 
				${interestsCondition} 
				ORDER BY id LIMIT 0,1000 
				) R
		JOIN users_interests UI on R.id = UI.user_id
		JOIN interests I ON I.id = UI.interest_id
		GROUP BY UI.user_id`
		const [users] = await db.query(query, [`^[${filters.orientation}]$`, minDob, maxDob, `%${filters.gender}%`, ...filters.interests])
		return users.map((x) => (
			{
			firstName: x.first_name,
			lastName: x.last_name,
			email: x.email,
			dob: x.dob,
			gender: x.gender,
			orientation: x.orientation,
			job: x.job,
			bio: x.bio,
			profilePic: x.profilePic,
			picture2: x.picture2,
			picture3: x.picture3,
			picture4: x.picture4,
			picture5: x.picture5,
			interests: x.interests.split(",")
			})
		)
		return result
	},
	emailConfirmation: async function({hashToken}, req) {
		console.log("Email Confirmation")
		const query = `SELECT * FROM users WHERE hashToken = ?`
		const users = await db.query(query, [hashToken])
		console.log(hashToken)
		if (users[0].length <= 0) { return false }
		
		return true
	},
	changePassword: async function({info}, req) {
		console.log(req.email)
		if (!req.isAuth) {
			return {content: "REQUEST UNAUTHORIZED"}
		}
		const [user] = await db.query('SELECT isOnboarded, password, id, email FROM users WHERE email=?', req.email)
		if (user.length === 0) {
			const error = new Error('User not found.')
			error.code = 401
			throw error
		}
		const isEqual = await bcrypt.compare(info.oldPassword, user[0].password)
		if (!isEqual) {
			const error = new Error('Password is incorrect.')
			error.code = 401
			throw error
		}
		if (info.oldPassword == info.newPassword) {
			return {content: "Invalid new password"}
		}
		const hashedPw = await bcrypt.hash(info.newPassword, 12)
		await db.query('UPDATE users SET password = (?) WHERE email=?', [hashedPw, info.email])
		return {content: "Password succesfully changed "}
	}
}