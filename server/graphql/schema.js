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

    input renewPassword {
        email: String!
        oldPassword: String!
        newPassword: String!
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

    input emailData {
        email: String!
        subject: String!
    }
    
    type UserData {
        id: Int
        firstName: String!
        lastName: String!
        password: String
        email: String!
        dob: String!
        gender: String!
        orientation: String!
        job: String!
        bio: String!
        profilePic: String!
        picture2: String
        picture3: String
        picture4: String
        picture5: String
        isOnboarded: Boolean!
        interests: [String]
        blocked: Boolean
    }
    
    input MatchFilter {
        gender: String!
        orientation: String!
        minAge: Int!
        maxAge: Int!
        interests: [String]
        latitude: Float
        longitude: Float
        radius: Int
    }
    
    input LikeInput {
        receiverId: Int!
        liked: Boolean
    }
    
     input BlockInput {
        receiverId: Int!
        blocked: Boolean
    }
    
    type LikeData {
        likeTo: Boolean!
        likeFrom: Boolean!
    }
    
    type RelationsData {
        likeTo: Boolean!
        likeFrom: Boolean!
        blockTo: Boolean!
        blockFrom: Boolean!
    }
    
    type RootQuery {
        login(email: String!, password: String!): AuthData!
        getUserData(id: Int!): UserData
        relationsData(id: Int!): RelationsData
        isOnboarded: Boolean!
        match(filters: MatchFilter) : [UserData]
        usedInterests: [String]!
        likeInfo(info: LikeInput) : LikeData
    }
    
    type RootMutation {
        createUser(userInput: UserInputData) : User!
        emailConfirmation(token: String!): AuthData!
        passwordResetEmail(data: emailData) : Message
        resetPassword(token: String!, password: String!, confirmationPassword: String!): AuthData!
        changePassword(info: renewPassword): Message
        insertProfileInfo(info: UserProfileInfo) : Message 
        insertPictureInfo(info: UserPictureInfo) : Message
        insertBioInfo(info: UserBioInfo) : Message
        markOnboarded : Message
        resendConfirmationEmail(email: String): Message 
        toggleLike(info: LikeInput): Message
        toggleBlock(info: BlockInput): Message
        saveLocation(lat: Float!, long: Float!) : Message
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
