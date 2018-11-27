import React, {Component} from 'react';
import styles from './LoginPage.module.css'
import LoginDialog from './LoginDialog/LoginDialog'
import Button from "@material-ui/core/es/Button/Button";
import SignupDialog from "./SignupDialog/SignupDialog";

class LoginPage extends Component {
	state = {
		loginDialogOpen: false,
		signupDialogOpen: false
	};

	openLoginHandler = () => {
		this.setState({ loginDialogOpen: true });
	};

	closeLoginHandler = () => {
		this.setState({ loginDialogOpen: false });
	};

	openSignupHandler = () => {
		this.setState({ signupDialogOpen: true });
	};

	closeSignupHandler = () => {
		this.setState({ signupDialogOpen: false });
	};


	render() {
		const { onLogin } = this.props
		return (
			<div className={styles.component}>
				<div className={styles.buttons}>
				<Button style={{ margin: '15px', width: '200px'}} variant="extendedFab" color="secondary" onClick={this.openLoginHandler}>LOG IN</Button>
				<Button style={{ margin: '15px', width: '200px'}} variant="extendedFab" color="secondary" onClick={this.openSignupHandler}>SIGN UP</Button>
				</div>
					<LoginDialog
					open={this.state.loginDialogOpen}
					onClose={this.closeLoginHandler}
					onLogin={onLogin}
				/>
				<SignupDialog
					open={this.state.signupDialogOpen}
					onClose={this.closeSignupHandler}
				/>
			</div>
		)
	}
}

export default LoginPage
