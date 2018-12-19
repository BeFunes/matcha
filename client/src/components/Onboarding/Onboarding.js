import React from 'react'
import styles from './Onboarding.module.css'
import OnboardingProfile from "./OnboardingProfile/OnboardingProfile"
import OnboardingBio from "./OnboardingBio/OnboardingBio"
import OnboardingPics from "./OnboardingPics/OnboardingPics"
import {insertProfileInfoMutation} from "../../graphql/mutations";
import {fetchGraphql} from "../../utils/graphql";

const defaultState = {
	completed: 40,
	currentPage: 0,
	firstName: '',
	lastName: '',
	dob: "1990-01-01",
	gender: 'Woman',
	orientation: 'Any',
	job: '',
	bio: '',
	tags: []
}

class Onboarding extends React.Component {
	state = defaultState

	nextPage = () => {
		this.setState({ currentPage: this.state.currentPage + 1 })
	}

	previousPage = () => {
		this.setState({ currentPage: this.state.currentPage - 1 })
	}

	localSaveProfileInfo = data => {
		this.setState({
			firstName: data.firstName,
			lastName: data.lastName,
			dob: data.dob,
			gender: data.gender,
			orientation: data.orientation
		})
	}

	submitProfileInfo = (data) => {
		this.localSaveProfileInfo(data)
		const gender = data.gender === "Woman" ? "F" : "M"
		const orientation = (function (orient) {
			switch (orient) {
				case 'Woman': return 'F'
				case 'Man': return 'M'
				default: return 'FM'
			}
		})(data.orientation)
		const query = insertProfileInfoMutation(data.firstName, data.lastName, data.dob, gender, orientation)
		const cb = resData => {
			if (resData.errors && resData.errors[0].status === 422) {
				throw new Error(
					"Validation failed. Make sure the email address isn't used yet!"
				)
			}
			if (resData.errors) {
				throw new Error('PROBLEM')
			}
			console.log(resData)
			this.nextPage()
		}
		fetchGraphql(query, cb, this.props.token, () => this.setState(defaultState))
	}

	localSaveBioInfo = (data) => {
		this.setState({
			job: data.job,
			bio: data.bio,
			tags: data.tags
		})
	}

	markOnboarded = () => {
		const mutation = {
			query: `mutation {
				markOnboarded {
				content
				} }	` }
		fetch('http://localhost:3001/graphql', {
			method: 'POST',
			body: JSON.stringify(mutation),
			headers: {
				Authorization: 'Bearer ' + this.props.token,
				'Content-Type': 'application/json'
			}
		})
			.then(res => {
				return res.json()
			})
			.then(resData => {
				if (resData.errors) {
					throw new Error('PROBLEM')
				}
				console.log(resData.data.markOnboarded.content)
				this.props.onboardingHandler()
			})
			.catch(err => {
				console.log(err)
			})
		}

	submitPicInfo = (data) => {
		let graphqlQuery = {
			query: `
			      mutation {
			        insertPictureInfo(info: {
			          profilePic: "${data.profilePic}",
			          picture2: "${data.picture2}",
			          picture3: "${data.picture3}",
			          picture4: "${data.picture4}",
			          picture5: "${data.picture5}",
			        }) {
			          content
			        } } `
		}
		return fetch('http://localhost:3001/graphql', {
			method: 'POST',
			body: JSON.stringify(graphqlQuery),
			headers: {
				Authorization: 'Bearer ' + this.props.token,
				'Content-Type': 'application/json'
			}
		})
		.then(res => {
			return res.json()
		})
		.then(resData => {
			if (resData.errors && resData.errors[0].status === 422) {
				throw new Error(
					"Validation failed"
				)
			}
			if (resData.errors) {
				throw new Error('Image upload failed')
			}
			console.log(resData.data.insertPictureInfo.content)
			this.setState({...data})
			this.nextPage()
		})
			.catch(err => {
				console.log(err)
			})
	}


	submitBioInfo = (data) => {
		this.localSaveBioInfo(data)
		const interestsString = '"' + data.tags.join('", "') + '"'
		const mutation = {
			query: ` mutation {
				 insertBioInfo(info: {
            job: "${data.job}", 
            bio:"${data.bio}", 
            interests: [${interestsString}]}) {
               content
          }	}`
		}
		fetch('http://localhost:3001/graphql', {
			method: 'POST',
			body: JSON.stringify(mutation),
			headers: {
				Authorization: 'Bearer ' + this.props.token,
				'Content-Type': 'application/json'
			}
		})
			.then(res => {
				return res.json()
			})
			.then(resData => {
				if (resData.errors && resData.errors[0].status === 422) {
					throw new Error(
						"Validation failed. Make sure the email address isn't used yet!"
					)
				}
				if (resData.errors) {
					throw new Error('PROBLEM')
				}
				console.log(resData.data.insertBioInfo.content)
				this.markOnboarded()
			})
			.catch(err => {
				console.log(err)
				this.setState(defaultState)
			})

	}


	render () {
		return (
			<div className={styles.component}>
				<header className={styles.header}>
					Your profile
				</header>
				{this.state.currentPage === 0 && <OnboardingProfile
					nextPage={this.nextPage}
					completedProgress={0}
					save={this.submitProfileInfo}
					tempSave={this.localSaveProfileInfo}
					firstName={this.state.firstName}
					lastName={this.state.lastName}
					dob={this.state.dob}
					gender={this.state.gender}
					orientation={this.state.orientation}
				/>}
				{this.state.currentPage === 1 && <OnboardingPics
					nextPage={this.nextPage}
					previousPage={this.previousPage}
					completedProgress={33}
					save={this.submitPicInfo}
					token={this.props.token}
					profilePic={this.state.profilePic}
					picture2={this.state.picture2}
					picture3={this.state.picture3}
					picture4={this.state.picture4}
					picture5={this.state.picture5}
				/>}
				{this.state.currentPage === 2 && <OnboardingBio
					previousPage={this.previousPage}
					completedProgress={66}
					tempSave={this.localSaveBioInfo}
					save={this.submitBioInfo}
					bio={this.state.bio}
					job={this.state.job}
					tags={this.state.tags}
				/>}
			</div>
		)
	}
}

export default Onboarding