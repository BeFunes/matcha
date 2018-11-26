import React, {Component} from 'react';

import Dialog from "@material-ui/core/es/Dialog/Dialog";
import DialogTitle from "@material-ui/core/es/DialogTitle/DialogTitle";

import styles from './LoginDialog.module.css'
import {sanitise} from "../../../utils/string";
import TextField from "@material-ui/core/es/TextField/TextField";


class LoginDialog extends React.Component {

	state = {
		email: {
			value: '',
			valid: false
		},
		password: {
			value: '',
			valid: false
		},
	};

	inputChangeHandler = (type, {target}) => {
		const sanitisedValue = sanitise(target.value)
		if (this.state[type] !== sanitisedValue)
			this.setState({[type]: {...this.state[type], value: sanitisedValue}});
	}

	handleListItemClick = value => {
		this.props.onClose(value);
	};

	render() {
		const { open, onClose} = this.props;

		return (
			<Dialog onClose={onClose} open={open}>
				<DialogTitle className={styles.dialogTitle} >LOGIN </DialogTitle>
				<form  noValidate autoComplete="off">
					<div><TextField
						// id="outlined-name"
						label="Email"

						className={styles.textField}
						placeholder="example@gmail.com"
						type="email"
						value={this.state.email.value}
						onChange={this.inputChangeHandler.bind(this, 'email')}
						margin="normal"
						variant="outlined"
					/>
					</div>
					<div>
					<TextField
						// id="outlined-name"
						label="Password"
						className={styles.textField}
						type="password"
						value={this.state.password.value}
						onChange={this.inputChangeHandler.bind(this, 'password')}
						margin="normal"
						variant="outlined"
					/>
					</div>
				</form>
			</Dialog>
		);
	}
}

export default LoginDialog
