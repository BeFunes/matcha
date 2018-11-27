import React from 'react';

import styles from './LoginDialog.module.css'
import {passwordCriteria, sanitise, validator} from "../../../utils/string";
import Dialog from "@material-ui/core/es/Dialog/Dialog";
import Button from "@material-ui/core/es/Button/Button";
import TextInput from "../../UI/TextInput/TextInput";


class LoginDialog extends React.Component {

	state = {
		email: {
			label: 'Email',
			type: 'email',
			value: '',
			valid: true,
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
			tooltip: passwordCriteria,
			value: '',
			valid: true,
			rules: {
				minLength: 8,
				maxLength: 40,
			}
		},
	};

	inputChangeHandler = (type, {target}) => {
		const sanitisedValue = sanitise(target.value)
		const valid = validator(target.value, this.state[type].rules, type)
		if (this.state[type] !== sanitisedValue)
			this.setState({[type]: {...this.state[type], value: sanitisedValue, valid: valid}});
	}

	render() {
		const { open, onClose, onLogin, loginFail} = this.props;
		const elementsArray = [];
		for (let key in this.state) {
			elementsArray.push({
				...this.state[key],
				id: key});
		}
		const allValid = elementsArray.every((x) => x.valid && x.value !== '')
		const login = () => onLogin({email: this.state.email.value, password: this.state.password.value})

		return (
			<Dialog onClose={onClose} open={open}>
				<form  noValidate autoComplete="off" className={styles.form}>
					{elementsArray.map(element => (
						<div key={element.id} >
							<TextInput
								label={element.label}
								type={element.type}
								value={element.value}
								style={element.style}
								placeholder={element.placeholder}
								onChange={this.inputChangeHandler.bind(this, element.id)}
								onKeyPress={e => { if (e.key === 'Enter' && allValid) { login() }}}
								error={!element.valid}
								autoComplete={element.autoComplete}
								tooltip={element.tooltip}
							/>
						</div> ))}
					{loginFail ? (<div className={styles.errorMessage}>
							Incorrect email or password
						</div>) : null}
					<div className={styles.buttons}>
						<Button variant={allValid ? "contained" : "outlined"}
						        color="secondary"
						        onClick={allValid ? () => login() : null}>
							Login
						</Button>
					</div>
					<p className={styles.passwordReset}> Forgot your password ?</p>
				</form>
			</Dialog>
		);
	}
}

export default LoginDialog
