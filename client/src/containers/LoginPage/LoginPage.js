import React, {Component} from 'react';
import styles from './LoginPage.css'
import Button from '@material-ui/core/Button';
import LoginDialog from './LoginDialog/LoginDialog'

const divStyle = {
	// margin: '40px',
	// border: '5px solid pink',
	backgroundColor: 'green',
	alignItems: 'center',
	justifyContent: 'center',
	display: 'flex',
	flexGrow: '1'
};

class LoginPage extends Component {
	state = {
		dialogOpen: false
	};



	handleClickOpen = () => {
		this.setState({ dialogOpen: true });
	};

	handleClose = () => {
		this.setState({ dialogOpen: false });
	};

	render() {
		const { onLogin } = this.props
		return (
			<div className={divStyle}>
				<div className={styles.test}>
					something
					     </div>
				<Button  variant="extendedFab" color="secondary" onClick={this.handleClickOpen}>SIGN IN</Button>
				<LoginDialog
					open={this.state.dialogOpen}
					onClose={this.handleClose}
				/>
			</div>
		)
	}
}

export default LoginPage
