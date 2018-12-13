import React, {Component} from 'react';


class Confirmation extends Component {

	emailConfirmationHandler = (hashToken) => {
		console.log("emailConfirmationHandler")
		const query = {
			query: `mutation {
				emailConfirmation(hashToken: "${hashToken}") {
				content
			  } }`
		}
		fetch('http://localhost:3001/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(query)
		}).then(res => {
			return res.json()
		})
		.then(resData => {
			if (resData.errors) {
				throw new Error ("Token confirmation failed")
			}
			console.log(resData.data.content)
			// this.setState({...resData.data.getUserData})
		})
		.catch(err => {
			console.log(err)
		})
	}

	render() {
		const hashToken = this.props.location.pathname.split("/confirmation/")
		console.log(hashToken)
		this.emailConfirmationHandler(hashToken[1])
		return (
			<div>
				Confirmed
			</div>
		)
	}
}

export default Confirmation
