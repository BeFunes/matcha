const { withFilter } = require('graphql-subscriptions')
const pubsub = require('./pubsub')



const subscription = {
    likeToggled: {
        subscribe: withFilter(() => pubsub.asyncIterator('likeToggled'), ({receiver}, {userId}) => {

        	console.log("receiver", receiver)
	        console.log("userId", userId)
        	return receiver === userId
        })
    }
}

module.exports = subscription