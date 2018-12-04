import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';

import styles from './App.module.css';
import Browse from "./components/Browse/Browse";
import LoginPage from "./components/LoginPage/LoginPage";
import Toolbar from "./components/Navigation/Toolbar/Toolbar";
import Profile from "./components/Profile/Profile";
import Chat from "./components/Chat/Chat";
import Onboarding from "./components/Onboarding/Onboarding";


class App extends Component {

	state = {
		isAuth: false,
		token: null,
		userId: null,
		loginFail: false,
		isOnboarded: false
	}

	componentDidMount() {
		const token = localStorage.getItem('token')
		const expiryDate = localStorage.getItem('expiryDate')
		if (!token || !expiryDate) { return }
		if (new Date(expiryDate) <= new Date()) {
			this.logoutHandler()
			return
		}
		const userId = localStorage.getItem('userId')
		const isOnboarded = localStorage.getItem('isOnboarded')
		const remainingTime = new Date(expiryDate).getTime() - new Date().getTime()
		this.setState({isAuth: true, token: token, userId: userId, isOnboarded: isOnboarded})
		this.setAutoLogout(remainingTime)
	}

	getUserData = () => {
		const query = {
			query: `{
                login(email: "${authData.email}", password: "${authData.password}") {
                    token
                    userId
                    isOnboarded
                }
            } `
		}



	}


	loginHandler = (data) => {
		this.setState({
			isAuth: true,
			token: data.token,
			userId: data.userId,
			isOnboarded: data.isOnboarded,
		})
		const expiryDate = new Date (new Date().getTime() + 60*60*1000)
		localStorage.setItem('token', data.token)
		localStorage.setItem('userId', data.userId)
		localStorage.setItem('expiryDate', expiryDate.toISOString())
		localStorage.setItem('isOnboarded', data.isOnboarded)
		this.setAutoLogout(60*60*1000)
	}

	logoutHandler = () => {
		this.setState({isAuth: false, token: null});
		localStorage.removeItem('token');
		localStorage.removeItem('expiryDate');
		localStorage.removeItem('userId');
		localStorage.removeItem('isOnboarded');
	};

	setAutoLogout = milliseconds => {
		setTimeout(() => {
			this.logoutHandler();
		}, milliseconds);
	};

	onboardingHandler = () => {
		this.setState({ isOnboarded: true})
		localStorage.setItem('isOnboarded', true)
	}

	render() {

		const routeZero = () => {
			if (this.state.isAuth && this.state.isOnboarded)
				return <Route path="/" exact component={Browse}/>
			else if (this.state.isAuth && !this.state.isOnboarded)
				return <Route path="/" render={(props) => <Onboarding token={this.state.token} onboardingHandler={this.onboardingHandler} {...props}/>} />
			else
				return <Route path="/" exact render={() => <LoginPage onLogin={this.loginHandler} loginFail={this.state.loginFail}/>}/>
	}

		return (
			<div className={styles.app}>
				<div>
					{this.state.isAuth && this.state.isOnboarded && <Toolbar />}
					<main className={this.state.isOnboarded ? styles.contentWithToolbar : styles.contentWithoutToolbar}>
						<Switch> {/* with switch, the route will consider only the first match rather than cascading down!*/}
							{routeZero()}
							<Route path="/profile" component={Profile}/>
							<Route path="/chat" component={Chat}/>
						</Switch>
					</main>
				</div>
			</div>

		);
	}
}

export default App;


/// direct components that are accessed through routing have access to
// special props 'history' and 'match'. Nested components don't.
// If we need the special props in other places, look up 'withRouter'