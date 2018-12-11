const RootQuery = require('./query')
const RootMutation = require('./mutation')
// const subscript = require('./subscript')

module.exports = {
    ...RootQuery,
    ...RootMutation
}