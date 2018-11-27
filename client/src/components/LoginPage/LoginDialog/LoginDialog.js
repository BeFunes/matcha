import React from 'react';

import styles from './LoginDialog.module.css'
import {sanitise} from "../../../utils/string";
import Dialog from "@material-ui/core/es/Dialog/Dialog";
import Button from "@material-ui/core/es/Button/Button";
import TextInput from "../../UI/TextInput/TextInput";


class LoginDialog extends React.Component {

	state = {
		email: {
			label: 'Email',
			type: 'email',
			value: '',
			error: false,
			autoComplete: 'email'
		},
		password: {
			label: 'Password',
			type: 'password',
			value: '',
			error: true
		},
	};

	inputChangeHandler = (type, {target}) => {
		const sanitisedValue = sanitise(target.value)
		if (this.state[type] !== sanitisedValue)
			this.setState({[type]: {...this.state[type], value: sanitisedValue}});
	}

	render() {
		const { open, onClose, onLogin} = this.props;
		const elementsArray = [];
		for (let key in this.state) {
			elementsArray.push({
				...this.state[key],
				id: key});
		}

		return (
			<Dialog onClose={onClose} open={open}>
				<form  noValidate autoComplete="off">
					{elementsArray.map(element => (
						<div key={element.id} >
							<TextInput
								label={element.label}
								type={element.type}
								value={element.value}
								placeholder={element.placeholder}
								onChange={this.inputChangeHandler.bind(this, element.id)}
								error={element.error}
								autoComplete={element.autoComplete}
							/>
						</div> ))}
					<div className={styles.buttons}>
						<Button variant="contained" color="secondary" onClick={() => onLogin({email: this.state.email.value, password: this.state.password.value})}>
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
