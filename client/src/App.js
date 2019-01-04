import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';

import styles from './App.module.css';
import Browse from "./components/Browse/Browse";
import LoginPage from "./components/LoginPage/LoginPage";
import Toolbar from "./components/Navigation/Toolbar/Toolbar";
import UserProfile from "./components/UserProfile/UserProfile";
import EditProfile from './components/EditProfile/EditProfile'
import Chat from "./components/Chat/Chat";
import Confirmation from "./components/Confirmation/Confirmation"
import Onboarding from "./components/Onboarding/Onboarding";
import ResetPassword from './components/ResetPassword/ResetPassword';
import {getUserAgentDataQuery, isOnboardedQuery, usedInterestsQuery} from "./graphql/queries";
import {fetchGraphql} from "./utils/graphql";
import {saveLocationMutation} from "./graphql/mutations";
import GeolocationDialog from "./components/GeolocationDialog/GeolocationDialog";
import geocoder from "geocoder";
import { ToastContainer } from 'react-toastify';
import {graphql} from "react-apollo/index";
import gql from "graphql-tag";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



class App extends Component {

	state = {
		isAuth: false,
		token: null,
		userId: null,
		isLoading: true,
		geolocationDialogOpen: false
	}

	componentDidMount() {
		console.log("COMP DID MOUNT")
		const token = localStorage.getItem('token')
		const expiryDate = localStorage.getItem('expiryDate')
		if (!token || !expiryDate) {
			return
		}
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

	componentWillReceiveProps({data}) {
		if (!!data && !!data.trackNotification) {
			toast(data.trackNotification.type + "FROM " + data.trackNotification.sender)
		}
	}

	getUserAgentData = (token) => {
		console.log("GET USER DATA")
		const query = getUserAgentDataQuery
		const cb = resData => {
			if (resData.errors) {
				throw new Error("User data retrieval failed .")
			}
			this.setState({
				user: {...resData.data.getUserAgentData},
				isOnboarded: resData.data.getUserAgentData.isOnboarded,
				isLoading: false
			})
			this.getLocation(token, resData.data.getUserAgentData.address)
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
				throw new Error("User data retrieval failed .")
			}
			if (resData.data.isOnboarded) {
				this.getUserAgentData(token)
				this.getUsedInterests(token)
			}
			else { this.setState({isLoading: false})}
		}
		fetchGraphql(query, cb, token)
	}

	openGeolocationDialog = (location) => {
		this.setState({suggestedLocation: location, geolocationDialogOpen: true})
	}

	closeGeolocationDialog = () => {
		this.setState({geolocationDialogOpen: false})
	}


	getLocation = (token, existingAddress) => {
		console.log("GET LOCATION")
		const openDialog = (lat, long, address) => {
			if (address !== existingAddress) {
				this.openGeolocationDialog({latitude: lat, longitude: long, address: address })
			}
		}
		if (!("geolocation" in navigator)) {
			console.log("geolocation not available")
			fetch('http://www.geoplugin.net/json.gp')
				.then((res) => res.json())
				.then((data) => {
						openDialog (data.geoplugin_latitude, data.geoplugin_longitude, data.geoplugin_city + ", " + data.geoplugin_countryName)
					}
				)
				.catch((err) => console.log(err))
		}
		console.log("here")
		navigator.geolocation.getCurrentPosition((position) => {
			const {latitude, longitude} = position.coords
			geocoder.reverseGeocode(latitude, longitude, (err, data) => {
				if (err) {
					fetch('http://www.geoplugin.net/json.gp')
						.then((res) => res.json())
						.then((data) => {
								openDialog (data.geoplugin_latitude, data.geoplugin_longitude, data.geoplugin_city + ", " + data.geoplugin_countryName)
							}
						)
						.catch((err) => console.log(err))
				}
				else {
					let address = data.results[0].formatted_address.split(",")
					while (address.length >= 3) { address.shift() }
					openDialog(latitude, longitude, address.join())
				}
			}, {key: 'AIzaSyDhO5lFvlxnnGx_eBwAmDsagl0tE-vxE2U'})
		})
	}


	saveLocation = () => {
		this.closeGeolocationDialog()
		const {latitude, longitude, address} = this.state.suggestedLocation
		this.setState({geolocation: {latitude: latitude, longitude: longitude}})
		const query = saveLocationMutation(latitude, longitude, address)
		const cb = resData => {
			if (resData.errors) {
				throw new Error(resData.errors[0].message)
			}
			console.log(resData.data)
		}
		fetchGraphql(query, cb, this.state.token)
	}

	loginHandler = (data) => {
		this.setState({
			isAuth: true,
			token: data.token,
			userId: data.userId,
			isOnboarded: data.isOnboarded,
			isLoading: false
		})
		const expiryDate = new Date(new Date().getTime() + 60 * 60 * 1000)
		localStorage.setItem('token', data.token)
		localStorage.setItem('userId', data.userId)
		localStorage.setItem('expiryDate', expiryDate.toISOString())
		this.setAutoLogout(60 * 60 * 1000)
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
		setTimeout(this.logoutHandler, milliseconds);
	};

	onboardingHandler = () => {
		this.setState({isOnboarded: true})
		this.getUserAgentData(this.state.token)
		this.getUsedInterests(this.state.token)
	}

//////////// todo: this seems weird? Why do we need it?
	checkUser() {
		if (typeof this.state.user === "undefined") {
		} else {
			return <Route path="/edit_profile"
			              render={(props) => <EditProfile {...props} user={this.state.user} token={this.state.token}
			                                              refreshUser={this.getUserAgentData}/>}/>
		}
	}

	render() {
		const hasAccess = this.state.isAuth && this.state.isOnboarded
		const {geolocationDialogOpen, suggestedLocation} = this.state
		const routeZero = () => {
			if (this.state.isAuth && !this.state.isOnboarded && !this.state.isLoading)
				return <Route path="/" render={(props) => <Onboarding token={this.state.token}
				                                                      onboardingHandler={this.onboardingHandler} {...props} />}/>
			else if (!this.state.isAuth)
				return <Route path="/" render={() => <LoginPage onLogin={this.loginHandler}/>}/>
			else
				return (
					<Route path="/" exact render={(props) => <Browse token={this.state.token} user={this.state.user}
					                                                 interests={this.state.interests}
					                                                 geolocation={this.state.geolocation}{...props} />}/>
					// 	<Route path="profile" component={UserProfile}/>
					// 	<Route path="chat" component={Chat}/>
				)
		}
		return (
			<div className={styles.app}>
			 <ToastContainer />
				<div>
					<main className={hasAccess ? styles.contentWithToolbar : styles.contentWithoutToolbar}>
						{hasAccess && <Route
							render={(props) => <Toolbar {...props} onLogout={this.logoutHandler} user={this.state.user}
							                            onProfileClick={this.onProfileCLick}/>}/>}
						<Switch> {/* with switch, the route will consider only the first match rather than cascading down!*/}
							{!this.state.isAuth && <Route path="/confirmation/:token" render={(props) => <Confirmation {...props}
							                                                                                           markLoggedIn={this.loginHandler}/>}/>}
							{!this.state.isAuth && <Route path="/reset_password/:token" component={ResetPassword}/>}
							{hasAccess && <Route path="/user_profile" component={UserProfile}/>}
							{hasAccess && this.checkUser()}
							{hasAccess && <Route path="/chat" component={Chat}/>}
							{routeZero()}
						</Switch>
					</main>
				</div>
				{hasAccess && this.state.suggestedLocation && <GeolocationDialog
					open={geolocationDialogOpen}
					onClose={this.closeGeolocationDialog}
					onYes={this.saveLocation}
					location={suggestedLocation}/>}
			</div>

		);
	}
}




const NOTIFICATION_SUBSCRIPTION = gql`
	subscription trackNotification($userId: Int!) {
		trackNotification(userId: $userId) {
			sender
			type
		}	
	}
`

export default (graphql(NOTIFICATION_SUBSCRIPTION, {
	options: (state) => {
		console.log(state)
		return ({
			variables: {
				userId: 1
			},
		})
	}
})(App))


/// direct components that are accessed through routing have access to
// special props 'history' and 'match'. Nested components don't.
// If we need the special props in other places, look up 'withRouter'

