import React, {Component} from 'react';
import styles from './LoginPage.module.css'
import LoginDialog from './LoginDialog/LoginDialog'
import SignupDialog from "./SignupDialog/SignupDialog";
import Fab from "@material-ui/core/es/Fab/Fab";

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
		return (
			<div className={styles.component}>
				<div className={styles.buttons}>
				<Fab style={{ margin: '15px', width: '200px'}} variant="extended" color="secondary" onClick={this.openLoginHandler}>LOG IN</Fab>
				<Fab style={{ margin: '15px', width: '200px'}} variant="extended" color="secondary" onClick={this.openSignupHandler}>SIGN UP</Fab>
				</div>
					<LoginDialog
					open={this.state.loginDialogOpen}
					onClose={this.closeLoginHandler}
					onLogin={this.props.onLogin}
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
