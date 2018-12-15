import React, {Component} from 'react';
import styles from './ProfileCard.module.css'
import classnames from 'classnames';
import FullHeart from '@material-ui/icons/Favorite'
import EmtpyHeart from '@material-ui/icons/FavoriteBorder'



class ProfileCard extends Component {

	state = { }


	toggleLike = () => {
		const mutation = {
			query: ` mutation {
				toggleLike (info: {receiverId: ${this.props.profile.id}, liked:${!this.state.liked}}) {
					content
				}
			}`
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
				if (resData.errors) {
					throw new Error(resData.errors[0].message)
				}
				console.log(resData.data.toggleLike.content)
				this.setState({liked: !this.state.liked})
			})
			.catch(err => {
				console.log(err)
			})
	}

	render() {
		const { firstName, age, lastName, profilePic, gender, liked } = this.props.profile
		const borderStyle = gender === 'F' ? styles.f : styles.m
		return (
			<div className={classnames(styles.component, borderStyle)}>
				<div className={styles.img}
				     style={{ backgroundImage: `url(${profilePic})`,
					     backgroundRepeat: 'noRepeat', backgroundSize: 'cover' }}
				>
					{this.state.liked ? <FullHeart
							className={styles.heart}
							color="secondary"
							onClick={this.toggleLike}
						/>
						: <EmtpyHeart
							className={styles.heart}
							onClick={this.toggleLike}
						/>}
				</div>
				<div className={styles.name}>
				{firstName} {lastName}
				</div>
				<div>{age}</div>
			</div>
		)
	}
}

export default ProfileCard
