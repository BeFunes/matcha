export const createUserMutation = (email, password) => ({
	query: `
            mutation {
                createUser(userInput: {
                    email: ${JSON.stringify(email)}, 
                    password: ${password}
                    }) { email }
               }`
})

export const insertProfileInfoMutation = (firstName, lastName, dob, gender, orientation) => ({
		query: ` mutation {
				insertProfileInfo (info: {
						firstName: ${JSON.stringify(firstName)}, 
						lastName:${JSON.stringify(lastName)}, 
						dob:${JSON.stringify(dob)}, 
						gender: ${JSON.stringify(gender)}, 
						orientation:${JSON.stringify(orientation)}}) {
					content
				}
			}`
	})

export const insertPictureInfoMutation = (data) => {
	const {profilePic, picture2, picture3, picture4, picture5} = data
	return ({
		query: `
			      mutation {
			        insertPictureInfo(info: {
			          profilePic: ${JSON.stringify(profilePic)},
			          picture2: ${JSON.stringify(picture2)},
			          picture3: ${JSON.stringify(picture3)},
			          picture4: ${JSON.stringify(picture4)},
			          picture5: ${JSON.stringify(picture5)},
			        }) {
			          content
			        } } `
	})
}

export const markOnboardedMutation = {
	query: `mutation {
				markOnboarded {
				content
				} }	`
}

export const markNotificationsAsSeenMutation = {
	query: `mutation {
				markNotificationsAsSeen {
				content
				} }	`
}

export const markMessagesAsSeenMutation = (senderId) => ({
	query: `mutation {
				markMessagesAsSeen(senderId: ${senderId}) {
				content
				} }	`
})

export const insertBioInfoMutation = (job, bio, interests) => ({
	query: ` mutation {
				 insertBioInfo(info: {
            job: ${job}, 
            bio: ${bio}, 
            interests: [${interests}]}) {
               content
          }	}`
})

export const emailConfirmationMutation = token => ({
	query: `mutation {
				emailConfirmation(token: ${JSON.stringify(token)}) {
				    token
	          userId
	          isOnboarded
			  } }`
})

export const resendConfirmationEmailMutation = (email) => ({
	query: `mutation {
				resendConfirmationEmail(email: ${JSON.stringify(email)}) {
				    content
			  } }`
})

export const toggleLikeMutation = (id, liked) => ({
	query: ` mutation {
				toggleLike (info: {receiverId: ${id}, liked:${liked}}) {
					content
				}
			}`
})

export const toggleBlockMutation = (id, bool) => ({
	query: ` mutation {
				toggleBlock (info: {receiverId: ${id}, blocked:${bool}}) {
					content
				}
			}`
})

export const markProfileVisitedMutation = (id) => ({
	query: ` mutation {
				profileVisited (receiverId: ${id}) {
					content
				}
			}`
})


export const passwordResetEmailMutation = (email) => ({
	query: `mutation {
                passwordResetEmail(data: {email: ${email}, subject: "password"}) {
                  content
                }
              } `
})

export const resetPasswordMutation = (token, password, confirmPassword) => ({
	query: `mutation {
				resetPassword(token: ${JSON.stringify(token)}, password: ${password}, confirmationPassword: ${confirmPassword}) {
				   userId
              } }`
})

export const saveLocationMutation = (lat, long, address) => ({
	query: `mutation {
				saveLocation(lat: ${lat}, long: ${long}, address: ${JSON.stringify(address)}) {
				content 
				}}
	`
})

export const editUserMutation = (data, pics) => ({
	query: `mutation {
		editUser(userInput: {
			requestEmail: ${JSON.stringify(data.requestEmail)},
			name: ${JSON.stringify(data.name)},
			lastName: ${JSON.stringify(data.lastName)},
			email: ${data.email},
			interests: [${data.interests}],
			bio: ${data.bio},
			gender: ${JSON.stringify(data.gender)},
			orientation: ${JSON.stringify(data.orientation)}
			profilePic: ${JSON.stringify(pics[0])}
			picture2: ${JSON.stringify(pics[1])}
			picture3: ${JSON.stringify(pics[2])}
			picture4: ${JSON.stringify(pics[3])}
			picture5: ${JSON.stringify(pics[4])}
		}) {content}
	}`
})

export const sendMessageMutation = (content, receiverId) => ({
	query: `mutation {
		sendMessage (content: ${content}, receiverId: ${receiverId}) {
			content
		}
	}`
})

export const reportUser = (userId) => ({
	query: `mutation {
		reportUser(userId: ${userId}) {
			content
		}
	}`
})

export const markOfflineMutation = {
	query: `mutation {
		markOffline {
			content
		}
	}`
}


export const startChatMutation = (id) => ({
	query: `mutation {
		startChat (receiverId: ${id}) {
			senderId
			receiverId
			content
			timestamp
			conversationName
			picture
			conversationId
			otherId
			meta
		}
	}`
})