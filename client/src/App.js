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

	loginHandler = (authData) => {
		console.log("LOGIN HANDLER")  ////////////////////REMOVE
		const query = {
			query: `{
                login(email: "${authData.email}", password: "${authData.password}") {
                    token
                    userId
                    isOnboarded
                }
            } `
		}
		fetch('http://localhost:3001/graphql', {
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
				if (resData.errors && resData.errors[0].status === 422) {
					throw new Error(
						"Validation failed."
					)
				}
				if (resData.errors) {
					this.setState({isAuth: false, loginFail: true})
					throw new Error ("User login failed.")
				}
				console.log(resData)

				this.setState({
					isAuth: true,
					token: resData.data.login.token,
					userId: resData.data.login.userId,
					isOnboarded: resData.data.login.isOnboarded,
				})
				const expiryDate = new Date (new Date().getTime() + 60*60*1000)
				localStorage.setItem('token', resData.data.login.token)
				localStorage.setItem('userId', resData.data.login.userId)
				localStorage.setItem('expiryDate', expiryDate.toISOString())
				localStorage.setItem('isOnboarded', resData.data.login.isOnboarded)
				this.setAutoLogout(60*60*1000)
			})
			.catch(err => {
				console.log(err)
				this.setState({
					isAuth: false,
				})
			})
	}

	logoutHandler = () => {
		this.setState({isAuth: false, token: null});
		localStorage.removeItem('token');
		localStorage.removeItem('expiryDate');
		localStorage.removeItem('userId');
	};

	setAutoLogout = milliseconds => {
		setTimeout(() => {
			this.logoutHandler();
		}, milliseconds);
	};

	onboardingHandler = () => {
		this.setState({ isOnboarded: true})
	}

	render() {
		const main = (
			<div>
				{this.state.isAuth && this.state.isOnboarded && <Toolbar />}
				<Switch> {/* with switch, the route will consider only the first match rather than cascading down!*/}
					<Route path="/" exact component={Browse}/>
					<Route path="/profile" component={Profile}/>
					<Route path="/chat" component={Chat}/>
					<Route path="/onboarding" component={Onboarding}/>
				</Switch>
			</div>
			)


		const routeZero = () => {
			if (this.state.isAuth && this.state.isOnboarded)
				return <Route path="/" exact component={Browse}/>
			else if (this.state.isAuth && !this.state.isOnboarded)
				return <Route path="/" render={() => <Onboarding token={this.state.token} onboardingHandler={this.onboardingHandler}/>} />
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