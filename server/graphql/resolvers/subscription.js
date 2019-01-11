const {withFilter} = require('graphql-subscriptions')
const pubsub = require('./pubsub')


const subscription = {
	userInfoChange: {
		subscribe: withFilter(() => pubsub.asyncIterator('userInfoChange'), ({userInfoChange}, {userId}) => {
			return !userInfoChange.receiver || userInfoChange.receiver === userId
		})
	},
	trackNotification: {
		subscribe: withFilter(() => pubsub.asyncIterator('notification'), ({trackNotification}, {userId}) => {
			return trackNotification.receiver === userId && trackNotification.receiver !== trackNotification.sender
		})
	},
	newMessage: {
		subscribe: withFilter(() => pubsub.asyncIterator('newMessage'), ({newMessage}, {userId}) => {
			return newMessage.receiverId === userId
			})
	},
}

module.exports = subscription