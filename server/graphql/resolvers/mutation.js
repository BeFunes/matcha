const jwt = require('jsonwebtoken')
const db = require('../../util/db')
const bcrypt = require('bcryptjs')
const { validate } = require('./../../util/validator')
const confirmationEmail = require('../../util/confirmationEmail')
const CONST = require('../../../constants')


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
		await confirmationEmail.sendConfirmationEmail(userInput.email)
		const hashedPw = await bcrypt.hash(userInput.password, 12)
		await db.query('Insert into users (email, password) VALUES (?, ?)', [userInput.email, hashedPw])


		// check return value and send error if appropriate
		// console.log(row)
		return {email: userInput.email}
	},

	emailConfirmation: async function({token}, req) {
		console.log("EMAIL CONFIRMATION")
		let decodedToken;
		try {
			decodedToken = jwt.verify(token, CONST.EMAIL_CONFIRMATION_SECRET);
		} catch (err) {
			const {email} = jwt.verify(token, '🍗🍡⏰', {ignoreExpiration: true})
			const e = new Error(err.message)
			e.data = email
			throw e
		}
		if (!decodedToken) {
			throw new Error("Invalid token")
		}
		const query = `SELECT isConfirmed, id, isOnboarded FROM users WHERE email = ?`
		const [users] = await db.query(query, [decodedToken.email])
		if (users.length <= 0) {
			throw new Error("User does not exist")
		}
		if (users[0].isConfirmed === 1) {
			throw new Error("Account already confirmed")
		}
		const mutation = `UPDATE users SET isConfirmed = 1 WHERE email = ?`
		const [row] = await db.query(mutation, [decodedToken.email])
		console.log(row)

		const authToken = jwt.sign(
			{userId: users[0].id, email: decodedToken.email},
			CONST.SECRET,
			{expiresIn: '1h'}
		)
		return {token: authToken, userId: users[0].id, isOnboarded: !!users[0].isOnboarded}
		// return { content: "Account confirmed successfully"}
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
		const [resBioInfo] = await db.query(query, [info.job, info.bio, req.email])
		console.log(resBioInfo)
		const interests = info.interests.map(x => [x])
		const interestQuery = `INSERT IGNORE INTO interests (title) values ?`
		const [resInterests] = await db.query(interestQuery, [interests])
		console.log(resInterests)
		const interestsIdQuery = `SELECT id FROM interests WHERE title IN (${info.interests.map(() => "?").join()})`
		const [ids] = await db.query(interestsIdQuery, info.interests)
		console.log(ids)
		const usersInterestsQuery = 'INSERT INTO users_interests (interest_id, user_id) values ?'
		const [resUserInterests] = await db.query(usersInterestsQuery, [ids.map((x) => [ x.id, req.userId ])])
		console.log(resUserInterests)
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
	changePassword: async function({info}, req) {
		console.log("HERE")
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
		if (info.oldPassword === info.newPassword) {
			return {content: "Invalid new password"}
		}
		const hashedPw = await bcrypt.hash(info.newPassword, 12)
		await db.query('UPDATE users SET password = (?) WHERE email=?', [hashedPw, info.email])
		return {content: "Password succesfully changed "}
	},
	insertPictureInfo: async function({info}, req) {
		console.log("INSERT PICTURE INFO")
		if (!req.isAuth) {
			const error = new Error('Not authenticated!')
			error.code = 401
			throw error
		}
		if (!validate(info.profilePic, "pic")) {
			const error = new Error('Validation Error')
			error.code = 422
			throw error
		}
		const query = `UPDATE users SET profilePic = ?, picture2 = ?, picture3 = ?, picture4 = ?, picture5 = ? WHERE email = ?`
		const [row] = await db.query(query, [info.profilePic, info.picture2, info.picture3, info.picture4, info.picture5, req.email])
		return {content: "Pic data updated successfully"}
	},
	resendConfirmationEmail: async function ({email}) {
		console.log("RESEND CONFIRMATION EMAIL")
		const [users] = await db.query('SELECT isConfirmed FROM users WHERE email=?', email)
		if (users.length <= 0) {
			throw new Error("User does not exist")
		}
		if (users[0].isConfirmed === 1) {
			throw new Error("Account already confirmed")
		}
		await confirmationEmail.sendConfirmationEmail(email)
		return { content: "Email re-sent successfully"}
	}
}
