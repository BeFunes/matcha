import React, {Component} from 'react';
import styles from './Browse.module.css'
import FilterPanel from "./FilterPanel/FilterPanel";
import Display from "./Display/Display";

class Browse extends Component {

	state = {
		filters: {
			ageMin: 30,
			ageMax: 50
		}
	}

	componentDidMount() {
		this.getProfiles(this.state.filters)
	}

	getProfiles = (data) => {
		console.log("GET PROFILES")
		let query = {
			query: ` {
			      match(
					    filters:{
					       gender : "F",
					        orientation : "MF",
					        minAge : ${data.ageMin},
					        maxAge : ${data.ageMax},
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
				    dob
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
				this.setState({matches: resData.data.match, filters: {...data}})
			})
			.catch(err => {
				console.log(err)
			})
	}

	render() {
		return (
			<div className={styles.component}>
				<FilterPanel
					onFilterChange={this.getProfiles}
					filters={this.state.filters}
				/>
				<Display
					profiles={this.state.matches}
				/>
			</div>
		)
	}
}

export default Browse
