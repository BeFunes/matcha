export const createUserMutation = (email, password) => ({
	query: `
            mutation {
                createUser(userInput: {
                    email: "${email}", 
                    password: "${password}"
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