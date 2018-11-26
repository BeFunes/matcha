import React from 'react';


import styles from './SignupDialog.module.css'
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
		password2: {
			value: '',
			valid: false
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
				this.props.history.push('/')
				// this.setState({isAuth: false})
			})
			.catch(err => {
				console.log(err)
				this.setState({
					isAuth: false,
					authLoading: false,
					error: err
				})
			})
	}


	inputChangeHandler = (type, {target}) => {
		const sanitisedValue = sanitise(target.value)
		if (this.state[type] !== sanitisedValue)
			this.setState({[type]: {...this.state[type], value: sanitisedValue}});
	}

	render() {
		const { open, onClose} = this.props;

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
					<div>
						<TextField
							// id="outlined-name"
							label="Repeat password"
							type="password"
							value={this.state.password2.value}
							onChange={this.inputChangeHandler.bind(this, 'password2')}
							margin="normal"
							variant="outlined"
							style={{
								margin: '10px 15px'
							}}
						/>
					</div>
					<div className={styles.buttons}>
						<Button variant="contained" color="secondary" onClick={this.signupHandler}>
							Sign Up
						</Button>
					</div>
				</form>
			</Dialog>
		);
	}
}

export default LoginDialog
