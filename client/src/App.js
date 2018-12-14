import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';

import styles from './App.module.css';
import Browse from "./components/Browse/Browse";
import LoginPage from "./components/LoginPage/LoginPage";
import Toolbar from "./components/Navigation/Toolbar/Toolbar";
import Profile from "./components/Profile/Profile";
import Chat from "./components/Chat/Chat";
import Confirmation from "./components/Confirmation/Confirmation"
import Onboarding from "./components/Onboarding/Onboarding";



class App extends Component {

	state = {
		isAuth: false,
		token: null,
		userId: null,
		isLoading: true
	}

	componentDidMount() {
		console.log("COMP DID MOUNT")
		const token = localStorage.getItem('token')
		const expiryDate = localStorage.getItem('expiryDate')
		if (!token || !expiryDate) { return }
		if (new Date(expiryDate) <= new Date()) {
			this.logoutHandler()
			return
		}
		const userId = localStorage.getItem('userId')
		const remainingTime = new Date(expiryDate).getTime() - new Date().getTime()
		this.setState({isAuth: true, token: token, userId: userId})
		this.setAutoLogout(remainingTime)
		if (typeof this.state.isOnboarded === 'undefined') {
			this.getIsOnboarded(token)
		}
	}

	getUserData = (token) => {
		console.log("GET USER DATA")
		const query = {
			query: `{
                getUserData {
                    firstName
										lastName
										password
										email
										dob
										gender
										orientation
										job
										bio
										interests
										profilePic
										picture2
										picture3
										picture4
										picture5
										isOnboarded
                }
            } `
		}
		fetch('http://localhost:3001/graphql', {
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(query)
		})
			.then(res => {
				return res.json()
			})
			.then(resData => {
				if (resData.errors) {
					throw new Error ("User data retrieval failed .")
				}
				this.setState({user: {...resData.data.getUserData}, isOnboarded: resData.data.getUserData.isOnboarded, isLoading: false })
			})
			.catch(err => {
				console.log(err)
			})
	}

	getUsedInterests = (token) => {
		console.log("GET USED INTERESTS")
		const query = {
			query: `{ usedInterests } `
		}
		fetch('http://localhost:3001/graphql', {
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(query)
		})
			.then(res => {
				return res.json()
			})
			.then(resData => {
				if (resData.errors) {
					throw new Error("Interests retrieval failed .")
				}
				this.setState({interests: resData.data.usedInterests})
			})
			.catch(err => {
				console.log(err)
			})
	}


	getIsOnboarded = (token) => {
		console.log("GET IS ONBOARDED")
		const query = {
			query: `{
            isOnboarded
            } `
		}
		fetch('http://localhost:3001/graphql', {
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(query)
		})
			.then(res => {
				return res.json()
			})
			.then(resData => {
				if (resData.errors) {
					throw new Error ("User data retrieval failed .")
				}
				if (resData.data.isOnboarded) {
					this.getUserData(token)
					this.getUsedInterests(token)
				}
			})
			.catch(err => {
				console.log(err)
			})
	}

	loginHandler = (data) => {
		this.setState({
			isAuth: true,
			token: data.token,
			userId: data.userId,
			isOnboarded: data.isOnboarded,
			isLoading: false
		})
		const expiryDate = new Date (new Date().getTime() + 60*60*1000)
		localStorage.setItem('token', data.token)
		localStorage.setItem('userId', data.userId)
		localStorage.setItem('expiryDate', expiryDate.toISOString())
		this.setAutoLogout(60*60*1000)
		if (data.isOnboarded) {
			this.getUserData(data.token)
			this.getUsedInterests(data.token)
		}
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
		this.setState({ isOnboarded: true })
		this.getUserData(this.state.token)
		this.getUsedInterests(this.state.token)
	}

	render() {
		console.log(this.state)
		const hasAccess = this.state.isAuth && this.state.isOnboarded
		const routeZero = () => {
			if (this.state.isAuth && !this.state.isOnboarded && !this.state.isLoading)
				return <Route path="/" render={(props) => <Onboarding token={this.state.token} onboardingHandler={this.onboardingHandler} {...props}/>} />
			else if (!this.state.isAuth)
				return <Route path="/" render={() => <LoginPage onLogin={this.loginHandler} />}/>
			else
				return (
					<Route path="/" exact render={() => <Browse token={this.state.token} user={this.state.user} interests={this.state.interests}/> } />
					// 	<Route path="profile" component={Profile}/>
					// 	<Route path="chat" component={Chat}/>
				)
	}

		return (
			<div className={styles.app}>
				<div>
					<main className={hasAccess ? styles.contentWithToolbar : styles.contentWithoutToolbar}>

						{hasAccess && <Toolbar onLogout={this.logoutHandler}/> }
						<Switch> {/* with switch, the route will consider only the first match rather than cascading down!*/}
							{<Route path="/confirmation/:token" render={(props) => <Confirmation {...props} markLoggedIn={this.loginHandler} />}/>}
							{hasAccess && <Route path="/profile" component={Profile}/>}
							{hasAccess && <Route path="/chat" component={Chat}/>}
							{routeZero()}
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

