import React, {Component} from 'react';
import Button from "@material-ui/core/es/Button/Button";
import styles from "./Confirmation.module.css"

class Confirmation extends Component {
	state = {
	}

	componentDidMount () {
		const token = this.props.location.pathname.split("/confirmation/")[1]
		this.emailConfirmationHandler(token)
	}

	emailConfirmationHandler = (token) => {
		console.log("emailConfirmationHandler")
		const query = {
			query: `mutation {
				emailConfirmation(token: "${token}") {
				    token
	          userId
	          isOnboarded
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
					let err = resData.errors[0].message
					if (err === "Account already confirmed") {
						this.props.markLoggedIn(resData.data.emailConfirmation)
						this.props.history.push('/')
					}
					else if (err === "jwt expired") {
						const email = resData.errors[0].data
						this.setState({error: "Sorry, your link is no longer valid", resendButton: true, userEmail: email})
					}
					else {
						this.setState({error: "Confirmation failed"})
					}
					throw new Error ("Token confirmation failed")
				}
				this.setState({isConfirmed: true})
				console.log(resData.data.emailConfirmation)
				this.props.markLoggedIn(resData.data.emailConfirmation)
				setTimeout(() => {this.props.history.push('/')}, 2000)

			})
			.catch(err => {
				console.log(err)
			})
	}

	resendEmail = () => {
		console.log("emailConfirmationHandler")
		if (!this.state.userEmail) { return }
		const query = {
			query: `mutation {
				resendConfirmationEmail(email: "${this.state.userEmail}") {
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
					throw new Error ("Couldn't send email")
				}
				console.log(resData.data.resendConfirmationEmail.content)
				this.setState({emailSent: true})

			})
			.catch(err => {
				console.log(err)
			})
	}


	render() {
		return (
			<div>
				{this.state.isConfirmed &&  <div>GOOD</div>}
				{this.state.error && <div>{this.state.error}</div>}
				{this.state.resendButton && !this.state.emailSent &&
				<Button
					onClick={this.resendEmail}
					color="secondary"
					variant="contained"
				>
					Resend link
				</Button>}
				{this.state.emailSent && <div>email sent</div>}
			</div>
		)
	}
}

export default Confirmation
