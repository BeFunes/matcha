import React, {Component} from 'react';
import {validator, sanitise} from '../../utils/string'

class SignUpForm extends Component {
	state = {
		email: {
			value: '',
			valid: false
		},
		password: {
			value: '',
			valid: false
		},
		isAuth: false
	};

	signupHandler = (event) => {
		event.preventDefault()
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


	inputChangeHandler = ({target}) => {
		const sanitisedValue = sanitise(target.value)
		if (this.state[target.type] !== sanitisedValue)
			this.setState({[target.type]: {...this.state[target.type], value: sanitisedValue}});
	}


	render() {
		return (
			<div>
				SIGN UP
				<form onSubmit={this.signupHandler}>
					<input
						id="email"
						// label="Your E-Mail"
						type="email"
						onChange={this.inputChangeHandler}
						// onBlur={this.inputBlurHandler.bind(this, 'email')}
						value={this.state.email.value}
					/>
					<input
						id="password"
						// label="Your E-Mail"
						type="password"
						onChange={this.inputChangeHandler}
						// onBlur={this.inputBlurHandler.bind(this, 'email')}
						value={this.state.password.value}
					/>
					<button type="submit"
						// loading={this.props.loading}
					>
						Signup
					</button>

				</form>
			</div>
		)
	}
}

export default SignUpForm
