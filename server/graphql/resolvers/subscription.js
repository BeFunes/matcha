const pubsub = requre('./pubsub')

const subscription = {
    likeToggled: {
        subscribe: () => pubsub.asyncIterator('likeToggled')
    }
}

module.exports = subscription