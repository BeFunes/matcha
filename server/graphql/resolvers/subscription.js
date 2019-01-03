const { withFilter } = require('graphql-subscriptions')
const pubsub = require('./pubsub')



const subscription = {
    likeToggled: {
        subscribe: withFilter(() => pubsub.asyncIterator('likeToggled'), ({receiver}, variables) => {
            console.log("__________ ", variables)
            console.log("_________ ", receiver)
        })
    }
}

module.exports = subscription