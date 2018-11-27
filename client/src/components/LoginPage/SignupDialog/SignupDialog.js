import React from 'react';

import styles from './SignupDialog.module.css'
import {sanitise} from "../../../utils/string";
import Dialog from "@material-ui/core/es/Dialog/Dialog";
import Button from "@material-ui/core/es/Button/Button";
import TextInput from "../../UI/TextInput/TextInput";


class SignupDialog extends React.Component {

	state = {
		email: {
			label: 'Email',
			type: 'email',
			value: '',
			error: false,
			placeholder: 'example@matcha.com',
			autoComplete: 'email'
		},
		password: {
			label: 'Password',
			type: 'password',
			value: '',
			error: true
		},
		password2: {
			label: 'Repeat password',
			type: 'password',
			value: '',
			error: false
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
		const elementsArray = [];
		for (let key in this.state) {
			elementsArray.push({
				...this.state[key],
				id: key});
		}

		return (
			<Dialog onClose={onClose} open={open}>
				<form  noValidate autoComplete="on">
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
						<Button variant="contained" color="secondary" onClick={this.signupHandler}>
							Sign Up
						</Button>
					</div>
				</form>
			</Dialog>
		);
	}
}

export default SignupDialog
