const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Query {
        hello: String
    }

    type User {
        id: ID!
        email: String!
        password: String!
        name: String
    }

    input UserInputData {
        email: String!
        password: String!
    }

    type RootMutation {
        createUser(userInput: UserInputData): User!
    }

    schema {
        query: Query
        mutation: RootMutation
    }
`);
