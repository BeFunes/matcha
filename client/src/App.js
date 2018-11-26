import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';

import styles from './App.module.css';
import Browse from "./containers/Browse/Browse";
import LoginPage from "./containers/LoginPage/LoginPage";
import Toolbar from "./components/Navigation/Toolbar/Toolbar";


class App extends Component {

	state = {
		isAuth: false,
		token: null,
		userId: null
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
	}

	loginHandler = (authData) => {
		console.log("LOGIN HANDLER")
		const query = {
			query: `
            {
                login(email: "${authData.email}", password: "${authData.password}") {
                    token
                    userId
                }
            }
            `
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
				// if (resData.errors && resData.errors[0].status === 422) {
				// 	throw new Error(
				// 		"Validation failed."
				// 	)
				// }
				if (resData.errors) {
					throw new Error ("User login failed.")
				}
				console.log(resData)
				this.setState({
					isAuth: true,
					token: resData.data.login.token,
					userId: resData.data.login.userId
				})
				const expiryDate = new Date (new Date().getTime() + 60*60*1000)
				localStorage.setItem('token', resData.data.login.token)
				localStorage.setItem('userId', resData.data.login.userId)
				localStorage.setItem('expiryDate', expiryDate.toISOString())
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


	render() {
		const main = (
			<aux>
				<Toolbar />
				<main className={styles.content}>
				<Switch> {/* with switch, the route will consider only the first match rather than cascading down!*/}
					<Route path="/" exact component={Browse}/>
				</Switch>
				</main>
			</aux>
			)

		return (
			<div className={styles.app}>
				{this.state.isAuth ? main : <LoginPage onLogin={this.loginHandler} /> }
			</div>

		);
	}
}

export default App;


/// direct components that are accessed through routing have access to
// special props 'history' and 'match'. Nested components don't.
// If we need the special props in other places, look up 'withRouter'