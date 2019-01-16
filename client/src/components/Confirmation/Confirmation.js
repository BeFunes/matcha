import React, {Component} from 'react';
import Button from "@material-ui/core/es/Button/Button";
import {emailConfirmationMutation, resendConfirmationEmailMutation} from "../../graphql/mutations";
import {fetchGraphql} from "../../utils/graphql";
import styles from "./Confirmation.module.css"

class Confirmation extends Component {
	state = {}

	componentDidMount () {
		const token = this.props.location.pathname.split("/confirmation/")[1]
		this.emailConfirmationHandler(token)
	}

	emailConfirmationHandler = (token) => {
		console.log("emailConfirmationHandler")
		const query = emailConfirmationMutation(token)
		const cb = resData => {
			if (resData.errors) {
				let err = resData.errors[0].message
				if (err === "Account already confirmed") {
					this.setState({error: "Your account is already confirmed. You will be redirected to the LOG IN page shortly."})
					setTimeout(() => {this.props.history.push('/')}, 2400)
				}
				else if (err === "jwt expired") {
					const email = resData.errors[0].data
					this.setState({error: "Sorry, your link is no longer valid", resendButton: true, userEmail: email})
				}
				else {
					this.setState({error: "Sorry, your account could not be activated."})
				}
				return
			}
			this.setState({isConfirmed: true})
			setTimeout(() => {this.props.markLoggedIn(resData.data.emailConfirmation); this.props.history.push('/')}, 1800)

		}
		fetchGraphql(query, cb)
	}

	resendEmail = () => {
		console.log("emailConfirmationHandler")
		if (!this.state.userEmail) { return }
		const query = resendConfirmationEmailMutation(this.state.userEmail)
		const cb = resData => {
			if (resData.errors) {
				throw new Error ("Couldn't send email")
			}
			console.log(resData.data.resendConfirmationEmail.content)
			this.setState({emailSent: true})

		}
		fetchGraphql(query, cb)
	}


	render() {
		return (
			<div className={styles.component}>
				{this.state.isConfirmed &&  <div className={styles.message}>Great! Your account is now active.</div>}
				{this.state.error && <div className={styles.message}>{this.state.error}</div>}
				{this.state.resendButton && !this.state.emailSent &&
				<Button
					className={styles.button}
					onClick={this.resendEmail}
					color="secondary"
					variant="contained"
				>
					Resend link
				</Button>}
				{this.state.emailSent && <div className={styles.emailSent}>Check your emails! We have sent you a new link to activate your account.</div>}
			</div>
		)
	}
}

export default Confirmation
