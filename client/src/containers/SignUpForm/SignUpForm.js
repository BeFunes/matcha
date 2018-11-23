import React, { Component } from 'react';

class SignUpForm extends Component {
    render () {
        return (
        <form>
            <label>
            Email:
                <input type="email" name="email" />
            </label>
            <label>
                Password:
                <input type="password" name="password" />
            </label>
            <input type="submit" value="Submit" />
        </form>
        )
    }
}

export default SignUpForm
