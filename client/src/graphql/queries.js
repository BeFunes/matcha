export const matchesQuery = (gender, orientation, ageMin, ageMax, interests) => ({
	query: ` {
			      match(
					    filters:{
					       gender : ${JSON.stringify(gender)},
					        orientation : ${JSON.stringify(orientation)},
					        minAge : ${JSON.stringify(ageMin)},
					        maxAge : ${ageMax},
					        interests : [${interests}],
					        latitude : 48.85154659837264,
					        longitude : 2.348984726384281,
					        radius: 5000 
					    })
				  {
				    firstName
				    id
				    lastName
				    orientation
				    gender
				    dob
				    interests
				    profilePic
				    blocked
				    latitude
				    longitude
				    online
				    lastOnline
				    chats
				    likeTo
				    likeFrom
				    fameRating
				  }  }     `
})

export const isOnboardedQuery = {
	query: `{
            isOnboarded
            } `
}

export const usedInterestsQuery = {
	query: `{ usedInterests } `
}

export const getUserDataQuery = (userId) => ({
	query: `{
                getUserData(id: ${userId}) {
                    id
                    firstName
										lastName
										dob
										gender
										orientation
										job
										bio
										interests
										profilePic
										picture2
										picture3
										picture4
										picture5
										latitude
										longitude
										address
										online
										lastOnline
										chats
                }
            } `
})


export const getUserAgentDataQuery = {
	query: `{
                getUserAgentData {
                    id
                    firstName
										lastName
										email
										dob
										gender
										orientation
										job
										bio
										interests
										profilePic
										picture2
										picture3
										picture4
										picture5
										isOnboarded
										latitude
										longitude
										address
										blockedUsers
										blockedByUsers
                }
            } `
}

export const getConversationsQuery = {
	query: `{
								conversations {
							    seen
							    content
							    senderId
							    receiverId
							    timestamp
							    conversationId
							    conversationName
							    otherId
							    picture
      }
	}`
}

export const loginQuery = (email, password) => ({
	query: `{
                login(email: ${JSON.stringify(email)}, password: ${password}) {
                    token
                    userId
                    isOnboarded
                }
            } `
})

export const relationsDataQuery = (id) => ({
	query: `{
                relationsData(id: ${id}) {
                    likeTo
                    likeFrom
                    blockTo
                    blockFrom
                }
            } `
})

export const notificationsQuery = {
	query: ` {
		notifications {
			seen
			type
			createdAt
			senderId
			senderName
		}
	}`
}
