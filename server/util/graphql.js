const db = require('./db')
const pubsub = require('./../graphql/resolvers/pubsub')

module.exports  = {
	checkAuth : (req) => {
		if (!req.isAuth) {
			const error = new Error('Not authenticated!')
			error.code = 401
			throw error
		}
	},
	markUserOnline : async function (userId) {
		await db.query(`UPDATE users SET online = true, lastOnline = now() WHERE id = ?`, [userId])
		pubsub.publish('userInfoChange', {userInfoChange: {onlineInfo: true, sender: userId, likeInfo: null}})
	}

}