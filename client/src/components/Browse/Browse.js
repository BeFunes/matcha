import React, {Component} from 'react';
import styles from './Browse.module.css'
import FilterPanel from "./FilterPanel/FilterPanel";
import Display from "./Display/Display";

class Browse extends Component {

	state = {}
	componentDidMount() {
		this.getProfiles()
	}

	getProfiles = () => {
		console.log("GET PROFILES")
		let query = {
			query: ` {
			      match(
					    filters:{
					       gender : "F",
					        orientation : "MF",
					        minAge : 18,
					        maxAge :50,
					        interests : ["football"],
					        latitude : 48.85154659837264,
					        longitude : 2.348984726384281,
					        radius: 5000 
					    })
				  {
				    firstName
				    lastName
				    orientation
				    gender
				    interests
				    profilePic
				  }  }     `
		}
		fetch('http://localhost:3001/graphql', {
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + this.props.token,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(query)
		})
			.then(res => {
				return res.json()
			})
			.then(resData => {
				if (resData.errors) {
					throw new Error ("Profiles search failed")
				}
				this.setState({matches: resData.data.match})
			})
			.catch(err => {
				console.log(err)
			})
	}

	render() {
		return (
			<div className={styles.component}>
				<FilterPanel/>
				<Display
					profiles={this.state.matches}
				/>
			</div>
		)
	}
}

export default Browse
