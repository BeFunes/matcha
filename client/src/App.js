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
		const remainingTime = new Date(expiryDate).getTime() - new Date().getTime()
		this.setState({isAuth: true, token: token, userId: userId})
		this.setAutoLogout(remainingTime)
		this.getUserData(token)
	}

	getUserData = (token) => {
		const query = {
			query: `{
                getUserData(info: "") {
                    firstName
										lastName
										password
										email
										dob
										gender
										orientation
										job
										bio
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
				this.setState({...resData.data.getUserData})
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
		})
		const expiryDate = new Date (new Date().getTime() + 60*60*1000)
		localStorage.setItem('token', data.token)
		localStorage.setItem('userId', data.userId)
		localStorage.setItem('expiryDate', expiryDate.toISOString())
		this.setAutoLogout(60*60*1000)
		this.getUserData(data.token)
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
		console.log(this.state)
		const hasAccess = this.state.isAuth && this.state.isOnboarded
		const routeZero = () => {
			if (hasAccess)
				return <Route path="/" exact component={Browse}/>
			else if (this.state.isAuth && !this.state.isOnboarded)
				return <Route path="/" render={(props) => <Onboarding token={this.state.token} onboardingHandler={this.onboardingHandler} {...props}/>} />
			else
				return <Route path="/" exact render={() => <LoginPage onLogin={this.loginHandler} loginFail={this.state.loginFail}/>}/>
	}

		return (
			<div className={styles.app}>
				<div>
					{hasAccess && <Toolbar />}
					<main className={hasAccess ? styles.contentWithToolbar : styles.contentWithoutToolbar}>
						<Switch> {/* with switch, the route will consider only the first match rather than cascading down!*/}
							{routeZero()}
							{hasAccess && <Route path="/profile" component={Profile}/> }
							{hasAccess && <Route path="/chat" component={Chat}/> }
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