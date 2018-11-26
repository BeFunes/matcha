const {buildSchema} = require('graphql');

module.exports = buildSchema(`

    type User {
        id: ID
        email: String!
        password: String
        name: String
    }

    input UserInputData {
        email: String!
        password: String!
    }

    type RootMutation {
        createUser(userInput: UserInputData) : User!
    }
    
    type AuthData {
        token: String!
        userId: String!
    }
    
    type RootQuery {
        login(email: String!, password: String!): AuthData!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
