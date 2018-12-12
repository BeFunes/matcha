import React, {Component} from 'react'
import styles from './Browse.module.css'
import FilterPanel from "./FilterPanel/FilterPanel"
import Display from "./Display/Display"
import _ from 'lodash'
import {getAge} from "../../utils/date";

class Browse extends Component {

	state = {
		filters: {
			ageMin: 30,
			ageMax: 50
		},
		sortValue: "location"
	}

	componentDidMount() {
		this.getProfiles(this.state.filters)
	}

	componentDidUpdate() {
		if (typeof this.state.matches === 'undefined') {
			this.getProfiles(this.state.filters)
		}
	}

	getProfiles = (data) => {
		if (!this.props.user) { return }
		console.log("GET PROFILES")
		let query = {
			query: ` {
			      match(
					    filters:{
					       gender : "${this.props.user.gender}",
					        orientation : "${this.props.user.orientation}",
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
				const matchesWithAge = resData.data.match.map(x => ({...x, age: getAge(x.dob)}))
				const sortedMatches = this.sort(matchesWithAge, this.state.sortValue)
				this.setState({matches: sortedMatches, filters: {...data}})
			})
			.catch(err => {
				console.log(err)
			})
	}

	sort = (array, sortValue) => {
		switch (sortValue) {
			case "age<":
				return _.orderBy(array, ['age'], ['asc'])
			case "age>":
				return _.orderBy(array, ['age'], ['desc'])
			case "location":
				return array
			case "interests":
				return _.orderBy(array, [x => _.intersection(x.interests, this.props.user.interests).length ], ['desc']);
			default:
				return array
		}
	}

	sortingChangeHandler = value => {
		console.log(value)
		let newMatches = this.sort(this.state.matches, value)
		this.setState({sortValue: value, matches: newMatches})
	}

	render() {
		return (
			<div className={styles.component}>
				{ this.props.user && <FilterPanel
					onFilterChange={this.getProfiles}
					filters={this.state.filters}
					onSortChange={this.sortingChangeHandler}
				/>}
				<Display
					profiles={this.state.matches}
				/>
			</div>
		)
	}
}

export default Browse
