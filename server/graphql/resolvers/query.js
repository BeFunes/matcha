const db = require('../../util/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validate } = require('./../../util/validator')
const CONST = require('../../../constants')
const _ = require ('lodash')


const query = {
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
			CONST.SECRET,
			{expiresIn: '1h'}
		)
		return {token: token, userId: user[0].id, isOnboarded: !!user[0].isOnboarded}
    },
    
	getUserData: async function (_, req) {
		console.log("GET USER INFO")
		if (!req.isAuth) {
			const error = new Error('Not authenticated!')
			error.code = 401
			throw error
		}
		const query = `SELECT U.*, GROUP_CONCAT(I.title) interests FROM (SELECT * from users WHERE email=?) U
		JOIN users_interests UI on U.id = UI.user_id
		JOIN interests I ON I.id = UI.interest_id
		GROUP BY UI.user_id `
		const [user] = await db.query(query, req.email)
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
			interests: user[0].interests.split(','),
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
		const interestsCondition = filters.interests.length ? `AND (${filters.interests.map(() => "I.title = ?").join(" OR ")})` : ''

		const query = `
		SELECT R.*, GROUP_CONCAT(I.title) interests FROM 
			( SELECT U.*
				FROM users_interests UI
				JOIN users U ON UI.user_id = U.id
				RIGHT JOIN interests I ON I.id = UI.interest_id
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
		/// IF NO INTERESTS ARE SPECIFIED, ALL ARE RETURNED
		const [users] = await db.query(query, [...array, ...filters.interests])
		const result = users.map((x) => (
			{
				firstName: x.first_name,
				id: x.id,
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
		return _.filter(result, (x) => _.difference(filters.interests, x.interests).length === 0)
	},

	usedInterests: async function(_, req) {
		console.log("GET USED INTERESTS")
		if (!req.isAuth) {
			const error = new Error('Not authenticated!')
			error.code = 401
			throw error
		}
		const query = `SELECT DISTINCT I.title FROM interests I
									RIGHT JOIN users_interests UI ON UI.interest_id = I.id`
		const [interests] = await db.query(query, req.email)
		if (interests.length === 0) {
			const error = new Error('No interests')
			error.code = 401
			throw error
		}
		return interests.map(x => x.title)
	},
	likeInfo: async function ({info}, req) {
		console.log("GET LIKE INFO")
		// if (!req.isAuth) {
		// 	const error = new Error('Not authenticated!')
		// 	error.code = 401
		// 	throw error
		// }
		req.userId = 122
		const userToMatchQuery = `SELECT EXISTS(SELECT * FROM likes WHERE sender_id = ? AND receiver_id = ?) val`
		const matchToUserQuery = `SELECT EXISTS(SELECT * FROM likes WHERE sender_id = ? AND receiver_id = ?) val`
		const [userToMatch] = await db.query(userToMatchQuery, [req.userId, info.receiverId])
		const [matchToUser] = await db.query(matchToUserQuery, [info.receiverId, req.userId])
		return { likes: userToMatch[0].val, isLiked: matchToUser[0].val }
	}
}

module.exports = query
