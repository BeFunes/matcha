const { withFilter } = require('graphql-subscriptions')
const pubsub = require('./pubsub')



const subscription = {
    likeToggled: {
        subscribe: withFilter(() => pubsub.asyncIterator('likeToggled'), ({likeToggled}, {userId}) => {
        	return likeToggled.receiver === userId
        })
    }
}

module.exports = subscription