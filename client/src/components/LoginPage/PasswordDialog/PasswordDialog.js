import React from 'react';

import styles from './PasswordDialog.module.css'
import { validator} from "../../../utils/string";
import Dialog from "@material-ui/core/es/Dialog/Dialog";
import Button from "@material-ui/core/es/Button/Button";
import TextInput from "../../UI/TextInput/TextInput";

class PasswordDialog extends React.Component {
    state = {
		inputFields: {
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
		},
		buttonDisabled: false,
	};

    inputChangeHandler = (type, {target}) => {
        const sanitisedValue = target.value.trim()
		const valid = validator(target.value, this.state.inputFields[type].rules, type)
		if (this.state.inputFields[type] !== sanitisedValue)
			this.setState({inputFields: {...this.state.inputFields, [type]: {...this.state.inputFields[type], value: sanitisedValue, valid: valid}}});
    }

    sendResetPasswordHandler = () => {
        console.log("RESET PASSWORD EMAIL HANDLER")
          ////////////////////REMOVE
        const email = JSON.stringify(this.state.inputFields.email.value)
		const query = {
			query: `mutation {
                passwordResetEmail(data: {email: ${email}, subject: "password"}) {
                  content
                }
              } `
        }
        console.log(query)
		fetch(`http://localhost:3001/graphql`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(query)
		})
			.then(res => {
				return res.json()
			})
			.then(resData => {
				if (resData.errors) {
					throw new Error(
						"Validation failed."
					)
				}
				if (resData.errors) {
					throw new Error ("Email Unknown")
				}
				console.log(resData)
				this.setState({buttonDisabled: true})
				setTimeout(this.props.onClose, 1000)
				
				
			})
			.catch(err => {
				console.log(err)
			})
			
	}
    

	render() {
        const {open, onClose} = this.props;
        const element = this.state.inputFields['email']
        const allValid = (element.valid && element.value !== '')
		return (
			<Dialog open={open} onClose={onClose}>
			<div key={element.id} >
							<TextInput
								label={element.label}
								type={element.type}
								value={element.value}
								style={element.style}
								placeholder={element.placeholder}
								onChange={this.inputChangeHandler.bind(this, element.type)}
								onKeyPress={e => { if (e.key === 'Enter' && allValid) { this.sendResetPasswordHandler() }}}
								error={!element.valid}
								autoComplete={element.autoComplete}
								tooltip={element.tooltip}
							/>
						</div>
                        <div className={styles.buttons}>
						<Button variant={allValid && !this.state.buttonDisabled ? "contained" : "outlined"}
								color="secondary"
						        onClick={allValid  && !this.state.buttonDisabled ? () => this.sendResetPasswordHandler() : null}>
							Reset Password
						</Button>
                        </div>
                        </Dialog>
		);
	}
}

export default PasswordDialog
