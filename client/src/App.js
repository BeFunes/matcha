import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';

import styles from './App.module.css';
import Browse from "./components/Browse/Browse";
import LoginPage from "./components/LoginPage/LoginPage";
import Toolbar from "./components/Navigation/Toolbar/Toolbar";
import Profile from "./components/Profile/Profile";
import UserProfile from "./components/UserProfile/UserProfile";
import Chat from "./components/Chat/Chat";
import Confirmation from "./components/Confirmation/Confirmation"
import Onboarding from "./components/Onboarding/Onboarding";
import ResetPassword from './components/ResetPassword/ResetPassword';
import {getUserAgentDataQuery, getUserDataQuery, isOnboardedQuery, usedInterestsQuery} from "./graphql/queries";
import {fetchGraphql} from "./utils/graphql";


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

	getUserAgentData = (token) => {
		console.log("GET USER DATA")
		const query = getUserAgentDataQuery
		const cb = resData => {
			if (resData.errors) {
				throw new Error ("User data retrieval failed .")
			}
			this.setState({user: {...resData.data.getUserAgentData}, isOnboarded: resData.data.getUserAgentData.isOnboarded, isLoading: false })
		}
		fetchGraphql(query, cb, token)
	}

	getUsedInterests = (token) => {
		console.log("GET USED INTERESTS")

		const query = usedInterestsQuery
		const cb = resData => {
			if (resData.errors) {
				throw new Error("Interests retrieval failed .")
			}
			this.setState({interests: resData.data.usedInterests})
		}
		fetchGraphql(query, cb, token)
	}


	getIsOnboarded = (token) => {
		console.log("GET IS ONBOARDED")
		const query = isOnboardedQuery
		const cb = (resData) => {
			if (resData.errors) {
				throw new Error ("User data retrieval failed .")
			}
			if (resData.data.isOnboarded) {
				this.getUserAgentData(token)
				this.getUsedInterests(token)
			}
		}
		fetchGraphql(query, cb, token)
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
			this.getUserAgentData(data.token)
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
		setTimeout(this.logoutHandler , milliseconds);
	};

	onboardingHandler = () => {
		this.setState({ isOnboarded: true })
		this.getUserAgentData(this.state.token)
		this.getUsedInterests(this.state.token)
	}

	onProfileCLick = () => {
		console.log("hello")
		this.props.history.push({ 
			pathname: `/user_profile`, 
			search: '',
			state : { user: this.props.user , id: `${this.props.user.id}` }
		})
	}



	render() {
		const hasAccess = this.state.isAuth && this.state.isOnboarded
		const routeZero = () => {
			if (this.state.isAuth && !this.state.isOnboarded && !this.state.isLoading)
				return <Route path="/" render={(props) => <Onboarding token={this.state.token} onboardingHandler={this.onboardingHandler} {...props}/>} />
			else if (!this.state.isAuth)
				return <Route path="/" render={() => <LoginPage onLogin={this.loginHandler} />}/>
			else
				return (
					<Route path="/" exact render={(props) => <Browse token={this.state.token} user={this.state.user} interests={this.state.interests} {...props} /> } />
					// 	<Route path="profile" component={UserProfile}/>
					// 	<Route path="chat" component={Chat}/>
				)
	}

		return (
			<div className={styles.app}>
				<div>
					<main className={hasAccess ? styles.contentWithToolbar : styles.contentWithoutToolbar}>

						{hasAccess && <Route  render={ (props) => <Toolbar {...props} onLogout={this.logoutHandler} user={this.state.user} onProfileClick={this.onProfileCLick} />}></Route> }
						<Switch> {/* with switch, the route will consider only the first match rather than cascading down!*/}
							{!this.state.isAuth && <Route path="/confirmation/:token" render={(props) => <Confirmation {...props} markLoggedIn={this.loginHandler} />}/>}
							{!this.state.isAuth && <Route path="/reset_password/:token" component={ResetPassword}/>}
							{hasAccess && <Route path="/user_profile" component={UserProfile} />}							
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

