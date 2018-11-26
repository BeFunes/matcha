import React from 'react';


import styles from './LoginDialog.module.css'
import {sanitise} from "../../../utils/string";
import TextField from "@material-ui/core/es/TextField/TextField";
import Dialog from "@material-ui/core/es/Dialog/Dialog";
import Button from "@material-ui/core/es/Button/Button";


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

	render() {
		const { open, onClose, onLogin} = this.props;

		return (
			<Dialog onClose={onClose} open={open}>
				{/*<DialogTitle*/}
					{/*className={styles.dialogTitle}*/}
					{/*style={{ fontSize: '15px'}}>*/}
					{/*Welcome*/}
				{/*</DialogTitle>*/}
				<form  noValidate autoComplete="off">
					<div><TextField
						// id="outlined-name"
						label="Email"

						placeholder="example@gmail.com"
						type="email"
						value={this.state.email.value}
						onChange={this.inputChangeHandler.bind(this, 'email')}
						margin="normal"
						variant="outlined"
						style={{
							margin: '10px 15px',
							// height: '50px',
						}}
					/>
					</div>
					<div>
					<TextField
						// id="outlined-name"
						label="Password"
						type="password"
						value={this.state.password.value}
						onChange={this.inputChangeHandler.bind(this, 'password')}
						margin="normal"
						variant="outlined"
						style={{
							margin: '10px 15px'
						}}
					/>
					</div>
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
