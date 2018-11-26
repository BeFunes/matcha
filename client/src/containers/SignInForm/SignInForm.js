import React, {Component} from 'react';
import { validator, sanitise } from '../../utils/string'

class SignInForm extends Component {
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

    signinHandler = (event) => {
        event.preventDefault()
        console.log("SIGN IN")
    }

    inputChangeHandler = ({target}) => {
        const sanitisedValue = sanitise(target.value)
        if (this.state[target.type] !== sanitisedValue)
            this.setState({[target.type]: {...this.state[target.type], value: sanitisedValue}});
    }

    goToSignUpHandler = () => {
        this.props.history.push('/signup')
    }

    render() {
        return (
            <div>
                SIGN IN
            <form onSubmit={this.signinHandler}>
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
                <button type='submit' onClick={this.goToSignUpHandler}>go to sign up</button>
            </div>
        )
    }
}

export default SignInForm
