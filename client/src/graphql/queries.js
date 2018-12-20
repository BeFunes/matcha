
export const matchesQuery = (gender, orientation, ageMin, ageMax, interests) => ({
	query: ` {
			      match(
					    filters:{
					       gender : "${gender}",
					        orientation : "${orientation}",
					        minAge : ${ageMin},
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
                }
            } `
})

export const loginQuery = (email, password) => ({
	query: `{
                login(email: "${email}", password: ${password}) {
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

export const likeInfoQuery = (id) => ({
	query: ` {
				likeInfo (info: {receiverId: ${id} }) {
				    likeTo
				    likeFrom
				  }
			}`
})