export const createUserMutation = (email, password) => ({
	query: `
            mutation {
                createUser(userInput: {
                    email: "${email}", 
                    password: ${password}
                    }) { email }
               }`
})

export const insertProfileInfoMutation = (firstName, lastName, dob, gender, orientation) => ({
		query: ` mutation {
				insertProfileInfo (info: {firstName: "${firstName}", lastName:"${lastName}", dob:"${dob}", gender: "${gender}", orientation:"${orientation}"}) {
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
			          profilePic: "${profilePic}",
			          picture2: "${picture2}",
			          picture3: "${picture3}",
			          picture4: "${picture4}",
			          picture5: "${picture5}",
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
				emailConfirmation(token: "${token}") {
				    token
	          userId
	          isOnboarded
			  } }`
})

export const resendConfirmationEmailMutation = (email) => ({
	query: `mutation {
				resendConfirmationEmail(email: "${email}") {
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
				toggleBlock (info: {receiverId: ${id}, blocked:${!bool}}) {
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

export const resetPasswordMutation = (token, password, confirmPassword ) => ({
	query: `mutation {
				resetPassword(token: "${token}", password: ${password}, confirmationPassword: ${confirmPassword}) {
				   userId
              } }`
})