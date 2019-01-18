const {checkAuth, markUserOnline} = require("../../util/graphql")

const db = require('../../util/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {validate} = require('./../../util/validator')
const CONST = require('../../../constants')
const lodash = require('lodash')
const moment = require("moment")


const query = {
	login: async function (_, {email, password}, {req}) {
		if (!validate(email, "email") || !validate(password, "password")) {
			const error = new Error('Validation Error')
			error.code = 422
			throw error
		}
		const [user] = await db.query('SELECT isOnboarded, password, id, email, isConfirmed FROM users WHERE email=?', email)
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
		if (!user[0].isConfirmed) {
			const error = new Error('User is not confirmed.')
			error.code = 401
			throw error
		}
		const token = jwt.sign(
			{userId: user[0].id, email: user[0].email},
			CONST.SECRET,
			{expiresIn: '1h'}
		)
		await markUserOnline(user[0].id)
		return {token: token, userId: user[0].id, isOnboarded: !!user[0].isOnboarded}
	},

	getUserData: async function (_, {id}, {req}) {
		console.log("GET USER INFO")
		checkAuth(req)
		const query = `
		SELECT A.* , B.chats FROM 
			(SELECT U.*, GROUP_CONCAT(I.title) interests FROM (SELECT * from users WHERE id=?) U
			JOIN users_interests UI on U.id = UI.user_id
			JOIN interests I ON I.id = UI.interest_id
			GROUP BY UI.user_id ) A
		LEFT JOIN 
			(SELECT U.id, COUNT(U.id) chats
			FROM users U
			JOIN messages M ON (M.sender_id = U.id AND M.receiver_id = ?) OR (M.sender_id = ? AND M.receiver_id = U.id)
			WHERE M.meta = 0
			GROUP BY U.id) = B
		ON A.id = B.id`
		const [user] = await db.query(query, [id, req.userId, req.userId])
		if (user.length === 0) {
			const error = new Error('User not found.')
			error.code = 401
			throw error
		}
		await markUserOnline(req.userId)
		return {
			id: user[0].id,
			firstName: user[0].first_name,
			lastName: user[0].last_name,
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
			latitude: user[0].latitude,
			longitude: user[0].longitude,
			address: user[0].address,
			online: user[0].online,
			chats: user[0].chats || 0,
			lastOnline: user[0].lastOnline.toLocaleString(),
		}
	},

	getUserAgentData: async function (_, x, {req}) {
		console.log("GET AGENT USER INFO")
		checkAuth(req)
		const query = `SELECT U.*, GROUP_CONCAT(I.title) interests FROM (SELECT * from users WHERE id=?) U
		JOIN users_interests UI on U.id = UI.user_id
		JOIN interests I ON I.id = UI.interest_id
		GROUP BY UI.user_id `
		const [user] = await db.query(query, req.userId)
		if (user.length === 0) {
			const error = new Error('User not found.')
			error.code = 401
			throw error
		}
		await markUserOnline(req.userId)
		return {
			id: user[0].id,
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
			isOnboarded: user[0].isOnboarded,
			latitude: user[0].latitude,
			longitude: user[0].longitude,
			address: user[0].address
		}
	},

	isOnboarded: async function (_, x, {req}) {
		console.log("GET IS ONBOARDED")
		checkAuth(req)
		// req.email = "david.baron@hotmail.com"
		const [user] = await db.query('SELECT isOnboarded FROM users WHERE email= ? ', req.email)
		if (user.length === 0) {
			const error = new Error('User not found.')
			error.code = 401
			throw error
		}
		await markUserOnline(req.userId)
		return user[0].isOnboarded
	},

	match: async function (_, {filters}, {req}) {
		console.log("MATCH")
		const today = new Date()
		const maxDob = `${today.getFullYear() - filters.minAge}-${("0" + (today.getMonth() + 1)).slice(-2)}-${("0" + today.getDate()).slice(-2)}`
		const minDob = `${today.getFullYear() - filters.maxAge}-${("0" + (today.getMonth() + 1)).slice(-2)}-${("0" + today.getDate()).slice(-2)}`
		const interestsCondition = filters.interests.length ? `AND (${filters.interests.map(() => "I.title = ?").join(" OR ")})` : ''

		const query = `
		SELECT A.*, B.chats 
			FROM (SELECT DISTINCT U.* FROM 
				(SELECT Z.*, COALESCE(B.count, 0) AS blocked FROM 
					(SELECT * FROM (SELECT R.*, GROUP_CONCAT(I.title) interests FROM 
						( SELECT *
							FROM users
							WHERE (gender REGEXP ?)
							AND (dob > ?)
							AND (dob < ?)
							AND (orientation LIKE ?) 
							ORDER BY id LIMIT 0,1000 
							) R
						JOIN users_interests UI on R.id = UI.user_id
						JOIN interests I ON I.id = UI.interest_id
						GROUP BY UI.user_id) A
						LEFT JOIN blocks B ON A.id = B.sender_id
						WHERE B.sender_id IS NULL OR B.receiver_id != ?) Z
					LEFT JOIN (
						SELECT receiver_id, COUNT(*) as COUNT
						FROM blocks WHERE sender_id = ?
						GROUP BY receiver_id ) as B
				ON Z.id = B.receiver_id) U
				JOIN users_interests UI ON UI.user_id = U.id
				JOIN interests I on I.id = UI.interest_id
				WHERE U.id != ?
				${interestsCondition} ) A
			LEFT JOIN  (SELECT U.id, COUNT(U.id) chats
					FROM users U
					JOIN messages M ON (M.sender_id = U.id AND M.receiver_id = ?) OR (M.sender_id = ? AND M.receiver_id = U.id)
					WHERE M.meta = 0
					GROUP BY U.id) = B
			ON A.id = B.id
			`

		/// IF NO INTERESTS ARE SPECIFIED, ALL ARE RETURNED
		const array = [`^[${filters.orientation}]$`, minDob, maxDob, `%${filters.gender}%`, req.userId, req.userId, req.userId, req.userId, req.userId]
		const [users] = await db.query(query, [...array, ...filters.interests])

		const userToMatchQuery = `SELECT EXISTS(SELECT * FROM likes WHERE sender_id = ? AND receiver_id = ?) val`
		const matchToUserQuery = `SELECT EXISTS(SELECT * FROM likes WHERE sender_id = ? AND receiver_id = ?) val`
		const result = users.map(async (x) => {
				const [userToMatch] = await db.query(userToMatchQuery, [req.userId, x.id])
				const [matchToUser] = await db.query(matchToUserQuery, [x.id, req.userId])
				const [likesReceived] = await db.query('SELECT COUNT(DISTINCT sender_id) count FROM likes WHERE receiver_id = ?', x.id)
				const [visitsReceived] = await db.query(`SELECT COUNT(DISTINCT from_id) count FROM notifications WHERE user_id = ? `, x.id)
				const fameRating = (likesReceived[0].count * 3) + visitsReceived[0].count
				return {
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
					interests: x.interests.split(","),
					blocked: !!x.blocked,
					latitude: x.latitude,
					longitude: x.longitude,
					address: x.address,
					online: x.online,
					lastOnline: x.lastOnline.toLocaleString(),
					chats: x.chats || 0,
					likeTo: userToMatch[0].val,
					likeFrom: matchToUser[0].val,
					fameRating: fameRating
				}
			}
		)
		await markUserOnline(req.userId)
		return lodash.filter(result, (x) => lodash.difference(filters.interests, x.interests).length === 0)
	},

	usedInterests: async function (_, x, {req}) {
		console.log("GET USED INTERESTS")
		checkAuth(req)
		const query = `SELECT DISTINCT I.title FROM interests I
									RIGHT JOIN users_interests UI ON UI.interest_id = I.id`
		const [interests] = await db.query(query, req.email)
		if (interests.length === 0) {
			const error = new Error('No interests')
			error.code = 401
			throw error
		}
		await markUserOnline(req.userId)
		return interests.map(x => x.title)
	},

	relationsData: async function (_, {id}, {req}) {
		console.log("GET RELATIONS DATA")
		checkAuth(req)
		const userLikesMatchQuery = `SELECT EXISTS(SELECT * FROM likes WHERE sender_id = ? AND receiver_id = ?) val`
		const matchLikesUserQuery = `SELECT EXISTS(SELECT * FROM likes WHERE sender_id = ? AND receiver_id = ?) val`
		const userBlocksMatchQuery = `SELECT EXISTS(SELECT * FROM blocks WHERE sender_id = ? AND receiver_id = ?) val`
		const matchBlocksUserQuery = `SELECT EXISTS(SELECT * FROM blocks WHERE sender_id = ? AND receiver_id = ?) val`

		const [userLikesMatch] = await db.query(userLikesMatchQuery, [req.userId, id])
		const [matchLikesUser] = await db.query(matchLikesUserQuery, [id, req.userId])
		const [userBlocksMatch] = await db.query(userBlocksMatchQuery, [req.userId, id])
		const [matchBlocksUser] = await db.query(matchBlocksUserQuery, [id, req.userId])
		await markUserOnline(req.userId)
		return {
			likeTo: userLikesMatch[0].val,
			likeFrom: matchLikesUser[0].val,
			blockTo: userBlocksMatch[0].val,
			blockFrom: matchBlocksUser[0].val
		}
	},

	conversations: async function (_, x, {req}) {
		console.log('GET USER MESSAGES')
		checkAuth(req)

		const query = `SELECT M.*, CONCAT(Sender.first_name, ' ', Sender.last_name) sender_name, 
CONCAT(Receiver.first_name, ' ', Receiver.last_name) receiver_name, Sender.profilePic sender_pic, Receiver.profilePic receiver_pic
				FROM messages M
				JOIN USERS Sender
				ON Sender.id = M.sender_id
				JOIN USERS Receiver
				ON Receiver.id = M.receiver_id
				WHERE (sender_id = ? OR receiver_id = ?)`
		const [row] = await db.query(query, [req.userId, req.userId])
		const convName = (id, senderId, receiverId, senderName, receiverName) => {
			return id === senderId ? receiverName : senderName
		}
		const conv = row.map(x => ({
			senderId: x.sender_id,
			receiverId: x.receiver_id,
			timestamp: x.time,
			seen: x.seen,
			meta: x.meta,
			content: x.content,
			conversationId: x.conversation_id,
			picture: req.userId === x.sender_id ? x.receiver_pic : x.sender_pic,
			conversationName: req.userId === x.sender_id ? x.receiver_name : x.sender_name,
			otherId: req.userId === x.sender_id ? x.receiver_id : x.sender_id,
		})).filter(x => !x.meta)
		///order by timestamp
		await markUserOnline(req.userId)
		const conversations = lodash.groupBy(conv, x => x.conversationId)
		return Object.keys(conversations).map(x => conversations[x])
	},

	notifications: async function (_, x, {req}) {
		console.log("GET NOTIFICATIONS FOR USER ", req.userId)
		checkAuth(req)
		const query = `SELECT N.*, U.first_name, U.last_name 
					FROM notifications N
					JOIN users U on N.from_id = U.id
					WHERE N.user_id = ? ORDER BY created_at DESC LIMIT 100`
		const [raw] = await db.query(query, [req.userId])
		await markUserOnline(req.userId)
		return raw.map(x => ({
			seen: x.open,
			senderId: x.from_id,
			type: x.type,
			createdAt: moment(x.created_at).format("D MMM, HH:mm"),
			senderName: `${x.first_name} ${x.last_name}`
		}))
	}
}

module.exports = query
