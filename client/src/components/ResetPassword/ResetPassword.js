import React, {Component} from 'react'
// import { withStyles } from "@material-ui/core/styles";
// import MenuItem from "@material-ui/core/MenuItem";
import styles from './ResetPassword.module.css'
import Button from "@material-ui/core/es/Button/Button";
import TextInput from "../UI/TextInput/TextInput";
import {passwordCriteria, validator} from "../../utils/string";
import {fetchGraphql} from "../../utils/graphql";
import {resetPasswordMutation} from "../../graphql/mutations";


class ResetPassword extends Component {
	state = {
		password: {
			label: 'New Password',
			type: 'password',
			tooltip: passwordCriteria,
			placeholder: 'New Password',
			value: '',
			valid: true,
			rules: {
				minLength: 8,
				maxLength: 40,
			}
		},
		confirmPassword: {
			label: 'Password',
			type: 'password',
			tooltip: passwordCriteria,
			placeholder: 'Confirm Your Password',
			value: '',
			valid: true,
			rules: {
				minLength: 8,
				maxLength: 40,
			}
		},
	};

	inputChangeHandler = (type, {target}) => {
		const sanitisedValue = target.value.trim()
		const valid = validator(sanitisedValue, this.state[type].rules, target.type)

		const checkConfirmationPassword = () => {
			if (type === 'confirmPassword' || type === 'password') {
				const pass2valid = (type === 'confirmPassword') ? valid : this.state.confirmPassword.valid
				const equal = this.state.password.value === this.state.confirmPassword.value
				this.setState({confirmPassword: {...this.state.confirmPassword, valid: pass2valid && equal}})
			}
		}
		if (this.state[type] !== sanitisedValue) {
			this.setState({[type]: {...this.state[type], value: sanitisedValue, valid: valid}}, checkConfirmationPassword);
		}
	}

	resetPassword = () => {
		console.log("RESET PASSWORD")
		//////// todo: WHY stringify the password?
		const password = JSON.stringify(this.state.password.value)
		const confirmPassword = JSON.stringify(this.state.confirmPassword.value)
		const token = this.props.location.pathname.split("/reset_password/")[1]

		const query = resetPasswordMutation(token, password, confirmPassword)
		const cb = resData => {
			if (resData.errors) {
				throw new Error(
					"Validation failed."
				)
			}
		}
		fetchGraphql(query, cb)
	}

	render() {
		const elementsArray = [];
		for (let key in this.state) {
			elementsArray.push({
				...this.state[key],
				id: key
			});
		}
		const allValid = elementsArray.every((x) => x.valid && x.value !== '')
		return (
			<div className={styles.element}>
				{elementsArray.map(element =>
					(
						<div key={element.id}>
							<TextInput
								label={element.label}
								type={element.type}
								value={element.value}
								style={element.style}
								placeholder={element.placeholder}
								onChange={this.inputChangeHandler.bind(this, element.id)}
								onKeyPress={e => {
									if (e.key === 'Enter' && allValid) {
										console.log('hey')
									}
								}}
								error={!element.valid}
								autoComplete={element.autoComplete}
								tooltip={element.tooltip}
							/>
						</div>))}
				<div>
					<Button
						variant={allValid ? "contained" : "outlined"}
						color="secondary"
						onClick={allValid ? () => this.resetPassword() : null}>
						Reset Password
					</Button>
				</div>
			</div>
		)
	}
}

export default ResetPassword