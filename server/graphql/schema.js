const {buildSchema} = require('graphql');

module.exports = buildSchema(`

    type User {
        id: ID
        email: String!
        password: String
        name: String
    }
	
		type Message {
				content: String
		}
		
    input UserInputData {
        email: String!
        password: String!
    }
		
		input UserProfileInfo {
				firstName: String!
				lastName: String!
				dob: String!
				gender: String!
				orientation: String!
		}
		
		input UserPictureInfo {
				profilePic: String!
				picture2: String
				picture3: String
				picture4: String
				picture5: String
		}
		
		input UserBioInfo {
				job: String!
				interests: [String!]!
				bio: String!
		}
		
    type AuthData {
        token: String!
        userId: String!
        isOnboarded: Boolean!
    }
    
    type UserData {
        firstName: String!
        lastName: String!
        password: String!
        email: String!
        dob: String!
        gender: String!
        orientation: String!
        job: String!
        bio: String!
        profilePic: String!
        picture2: String!
        picture3: String!
        picture4: String!
        picture5: String!
    }
    
    type RootQuery {
        login(email: String!, password: String!): AuthData!
        getUserData(info: String): UserData!
    }
    
    type RootMutation {
        createUser(userInput: UserInputData) : User!
        insertProfileInfo(info: UserProfileInfo) : Message 
        insertPictureInfo(info: UserPictureInfo) : Message
        insertBioInfo(info: UserBioInfo) : Message
        markOnboarded(info: String) : Message
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
