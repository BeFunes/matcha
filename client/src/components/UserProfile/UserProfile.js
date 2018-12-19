import React, {Component} from 'react';
import styles from './UserProfile.module.css'
import TextInput from "../UI/TextInput/TextInput";
import Lightbox from 'react-images';
import {getAge} from "../../utils/date";
import LocationIcon from "@material-ui/icons/LocationOn"
import JobIcon from "@material-ui/icons/Work"

const getRandomBackground = () => {
	const n = Math.floor(Math.random() * 999) + 1
	return `https://picsum.photos/800/150/?image=${n}`
}

class UserProfile extends Component {
	state = {
		user: {}
	}


	componentDidMount() {
		this.setState({userId: this.props.match.params.id, background: getRandomBackground()})
		const token = localStorage.getItem('token')
		this.getUserData(token)
	}


	getUserData = (token) => {
		console.log("GET USER DATA")
		const {id} = this.props.match.params
		const query = {
			query: `{
                getUserData(id: ${id}) {
                    firstName
										lastName
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
					throw new Error("User data retrieval failed .")
				}
				this.setState({user: {...resData.data.getUserData}})
			})
			.catch(err => {
				console.log(err)
			})
	}


	render() {
		const {firstName, lastName, dob, gender, orientation, job, bio, interests, profilePic, picture2, picture3, picture4, picture5} = this.state.user
		const imagesArray = [profilePic, picture2, picture3, picture4, picture5].map(x => ({src: x}))
		const city = "Paris"
		const country = "France"
		const age = dob && getAge(dob)
		// console.log(this.state.background)
		return (
			<div className={styles.component}>
				{this.state.user &&

				<div className={styles.page}>
					<div className={styles.header}
					     style={{
						     backgroundImage: `url(${this.state.background})`,
						     backgroundRepeat: 'noRepeat', backgroundSize: 'cover'
					     }}
					>
						<img className={styles.profilePic} src={profilePic}/>
						<div className={styles.infoBox}>
							<div className={styles.name}>{firstName} {lastName}</div>
							<div className={styles.minorInfo}> {age} years old </div>
							<div className={styles.minorInfo}> <LocationIcon style={{ fontSize: 15 }}/> {city}, {country}</div>
							<div className={styles.minorInfo}> <JobIcon style={{ fontSize: 15 }}/> {job} </div>
						</div>
					</div>
					<div className={styles.body}>
						<div className={styles.title}> Bio </div>
						<div>{bio}</div>
					</div>
					<div className={styles.body}>
					<div className={styles.title}> Photos </div>
					</div>

				</div>


				}

			</div>
		)
	}
}

export default UserProfile
// <Lightbox
// 	images={imagesArray}
// 	isOpen={true}
// 	onClose={alert}
// 	/>
