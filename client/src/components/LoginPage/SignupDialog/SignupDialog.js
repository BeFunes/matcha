import React from 'react';

import styles from './SignupDialog.module.css'
import {passwordCriteria, validator} from "../../../utils/string";
import Dialog from "@material-ui/core/es/Dialog/Dialog";
import Button from "@material-ui/core/es/Button/Button";
import TextInput from "../../UI/TextInput/TextInput";
import {createUserMutation} from "../../../graphql/mutations";
import {fetchGraphql} from "../../../utils/graphql";
import {toast} from 'react-toastify';


class SignupDialog extends React.Component {

	state = {
		textFields: {
			email: {
				label: 'Email',
				type: 'email',
				value: '',
				valid: true,
				placeholder: 'example@matcha.com',
				style: {margin: '20px 15px 10px'},
				autoComplete: 'email',
				rules: {
					minLength: 8,
					maxLength: 70,
				}
			},
			password: {
				label: 'Password',
				type: 'password',
				value: '',
				tooltip: passwordCriteria,
				valid: true,
				rules: {
					minLength: 8,
					maxLength: 40,
				}
			},
			password2: {
				label: 'Repeat password',
				type: 'password',
				value: '',
				valid: true,
				rules: {
					minLength: 8,
					maxLength: 40,
				}
			},
		}
	};

	signupHandler = () => {
		const password = JSON.stringify(this.state.textFields.password.value)
		const query = createUserMutation(this.state.textFields.email.value, password)
		const cb = resData => {
			if (resData.errors) {
				let message
				if (resData.errors[0].status === 422)
					message = "Sorry, the email or password are invalid."
				else if (resData.errors[0].message === "User exists already!")
					message = "Sorry, a user with this email address already exists."
				else
					message = "Sorry, we couldn't sign you up."
				this.setState({errorMessage: message, textFields: {...this.state.textFields, email: {...this.state.textFields.email, valid: false}}})
				return
			}
			toast.success("Check your emails! We have sent you a link to confirm the creation of your account", {
				autoClose: 3000
			})
			this.props.onClose()
		}
		fetchGraphql(query, cb)
	}

	inputChangeHandler = (type, {target}) => {
		const sanitisedValue = target.value.trim()
		const valid = validator(sanitisedValue, this.state.textFields[type].rules, target.type)
		const checkConfirmationPassword = () => {
			if (type === 'password2' || type === 'password') {
				const pass2valid = (type === 'password2') ? valid : this.state.textFields.password2.valid
				const equal = this.state.textFields.password.value === this.state.textFields.password2.value
				this.setState({textFields: {...this.state.textFields, password2: {...this.state.textFields.password2, valid: pass2valid && equal}}, errorMessage: ""})
			}
		}
		if (this.state[type] !== sanitisedValue) {
			this.setState({textFields: {...this.state.textFields, [type]: {...this.state.textFields[type], value: sanitisedValue, valid: valid}}, errorMessage: ""}, checkConfirmationPassword);
			}
		}


	render() {
		const { open, onClose} = this.props;
		const {errorMessage} = this.state
		const elementsArray = [];
		for (let key in this.state.textFields) {
			elementsArray.push({
				...this.state.textFields[key],
				id: key});
		}
		const allValid = elementsArray.every((x) => x.valid && x.value !== '')
		const onClick = allValid ? this.signupHandler : null
		return (
			<Dialog onClose={onClose} open={open}>
				<form  noValidate autoComplete="on">
					{elementsArray.map(element => (
					<div key={element.id} >
						<TextInput
							label={element.label}
							style={element.style}
							type={element.type}
							value={element.value}
							onKeyPress={e => { if (e.key === 'Enter' && allValid) { this.signupHandler() }}}
							placeholder={element.placeholder}
							onChange={this.inputChangeHandler.bind(this, element.id)}
							error={!element.valid}
							autoComplete={element.autoComplete}
							tooltip={element.tooltip}
						/>
					</div> ))}
					{!!errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
					<div className={styles.buttons}>
						<Button variant={allValid ? "contained" : "outlined"} color="secondary" onClick={onClick}>
							Sign Up
						</Button>
					</div>
				</form>
			</Dialog>
		);
	}
}

export default SignupDialog
