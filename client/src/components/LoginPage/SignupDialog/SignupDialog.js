import React from 'react';

import styles from './SignupDialog.module.css'
import {passwordCriteria, sanitise, validator} from "../../../utils/string";
import Dialog from "@material-ui/core/es/Dialog/Dialog";
import Button from "@material-ui/core/es/Button/Button";
import TextInput from "../../UI/TextInput/TextInput";


class SignupDialog extends React.Component {

	state = {
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
				maxLength: 40,
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
	};

	signupHandler = () => {
		const query = {
			query: `
            mutation {
                createUser(userInput: {
                    email: "${this.state.email.value}", 
                    password: "${this.state.password.value}"
                    }) { email }
               }`
		}
		fetch('http://localhost:3001/graphql', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(query)
		})
			.then(res => {
				console.log("AUTH OK")
				return res.json()
			})
			.then(resData => {
				if (resData.errors && resData.errors[0].status === 422) {
					throw new Error(
						"Validation failed. Make sure the email address isn't used yet!"
					);
				}
				if (resData.errors) {
					throw new Error('User creation failed!');
				}
				console.log(resData)
				this.props.onClose()
				// this.props.history.push('/')
				// this.setState({isAuth: false})
			})
			.catch(err => {
				console.log(err)
			})
	}

	inputChangeHandler = (type, {target}) => {
		const sanitisedValue = sanitise(target.value)
		const valid = validator(sanitisedValue, this.state[type].rules, target.type)

		const checkConfirmationPassword = () => {
			if (type === 'password2' || type === 'password') {
				const pass2valid = (type === 'password2') ? valid : this.state.password2.valid
				const equal = this.state.password.value === this.state.password2.value
				this.setState({password2: {...this.state.password2, valid: pass2valid && equal}})
			}
		}
		if (this.state[type] !== sanitisedValue) {
			this.setState({[type]: {...this.state[type], value: sanitisedValue, valid: valid}}, checkConfirmationPassword);
			}
		}


	render() {
		const { open, onClose} = this.props;
		const elementsArray = [];
		for (let key in this.state) {
			elementsArray.push({
				...this.state[key],
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
