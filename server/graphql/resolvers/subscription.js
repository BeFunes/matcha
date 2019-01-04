const { withFilter } = require('graphql-subscriptions')
const pubsub = require('./pubsub')



const subscription = {
    likeToggled: {
        subscribe: withFilter(() => pubsub.asyncIterator('likeToggled'), ({likeToggled}, {userId}) => {
        	return likeToggled.receiver === userId
        })
    },
    trackProfileVisited: {
        subscribe: withFilter(() => pubsub.asyncIterator('profileVisited'), ({trackProfileVisited}, {userId}) => {
            return trackProfileVisited.receiverId === userId && trackProfileVisited.receiverId !== trackProfileVisited.sender
        })
    }
}

module.exports = subscription