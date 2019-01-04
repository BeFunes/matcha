const { withFilter } = require('graphql-subscriptions')
const pubsub = require('./pubsub')



const subscription = {
    likeToggled: {
        subscribe: withFilter(() => pubsub.asyncIterator('likeToggled'), ({likeToggled}, {userId}) => {
        	return likeToggled.receiver === userId
        })
    },
    trackNotification: {
        subscribe: withFilter( () => pubsub.asyncIterator('notification'), ({trackNotification}, {userId}) => {
            return trackNotification.receiver === userId && trackNotification.receiver !== trackNotification.sender
        })
    }
}

module.exports = subscription