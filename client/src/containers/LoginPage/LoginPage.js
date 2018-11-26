import React, {Component} from 'react';
import styles from './LoginPage.module.css'
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
			<div className={styles.component}>
				<Button  variant="extendedFab" color="secondary" onClick={this.handleClickOpen}>SIGN IN</Button>
				<LoginDialog
					maxWidth='lg'
					open={this.state.dialogOpen}
					onClose={this.handleClose}
				/>
			</div>
		)
	}
}

export default LoginPage
