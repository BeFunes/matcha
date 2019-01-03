const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const subscription = {
    likeToggled: {
        subscribe: () => pubsub.asyncIterator('likeToggled')
    }
}

module.exports = subscription