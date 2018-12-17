import React, {Component} from 'react';
import styles from './ProfileCard.module.css'
import classnames from 'classnames';
import FullHeart from '@material-ui/icons/Favorite'
import EmptyHeart from '@material-ui/icons/FavoriteBorder'
import ChatBubbleEmpty from '@material-ui/icons/ChatBubbleOutline'
import ChatBubbleFull from '@material-ui/icons/ChatBubbleOutline'
import Block from '@material-ui/icons/Block'
import Redirect from "react-router-dom/es/Redirect";


class ProfileCard extends Component {

	state = {
		likeTo: false,
		likeFrom: false
	}

	componentDidMount() {
		this.getLikeInfo()
	}

	toggleLike = () => {
		const mutation = {
			query: ` mutation {
				toggleLike (info: {receiverId: ${this.props.profile.id}, liked:${!this.state.likeTo}}) {
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
				// console.log(resData.data.toggleLike.content)
				this.setState({likeTo: !this.state.likeTo})
			})
			.catch(err => {
				console.log(err)
			})
	}

	getLikeInfo = () => {
		const mutation = {
			query: ` {
				likeInfo (info: {receiverId: ${this.props.profile.id} }) {
				    likeTo
				    likeFrom
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
				// console.log(resData.data.likeInfo)
				if (this.props.profile.id === 4) {
					console.log(resData.data.likeInfo)
				}
				const {likeTo, likeFrom} = resData.data.likeInfo
				this.setState({likeTo: likeTo, likeFrom: likeFrom})
			})
			.catch(err => {
				console.log(err)
			})
	}

	blockUser = () => {
		const mutation = {
			query: ` mutation {
				toggleBlock (info: {receiverId: ${this.props.profile.id}, blocked:${!this.state.blocked}}) {
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
				console.log("user block toggled successfully")
				// this.setState({blocked: !this.state.blocked})
				this.props.onBlock(this.props.profile.id)
			})
			.catch(err => {
				console.log(err)
			})
	}

	render() {
		const {firstName, age, profilePic, gender, id} = this.props.profile
		const chat = this.state.likeFrom && this.state.likeTo
		const borderStyle = gender === 'F' ? styles.f : styles.m

		const renderHeart = () => {
			return (this.state.likeTo)
				? <FullHeart onClick={this.toggleLike} />
				: <EmptyHeart onClick={this.toggleLike}/>
		}

		const renderChat = () => {
			return (this.state.hasChatted)
			? <ChatBubbleFull/> : <ChatBubbleEmpty/>
		}

		const renderBlock = () =>
			<Block onClick={this.blockUser} color={this.props.profile.blocked ? "error" : "inherit"}/>


		return (
			<div className={classnames(styles.component, borderStyle)}>
				<div className={styles.img}
				     style={{
					     backgroundImage: `url(${profilePic})`,
					     backgroundRepeat: 'noRepeat', backgroundSize: 'cover'
				     }}
				     onClick={() => {this.props.history.push(`/user_profile/${id}`)}}
				/>
					<div className={styles.icons}>
						{renderHeart()}
						{chat && renderChat()}
						{renderBlock()}
					</div>
				{/*</div>*/}
				<div className={styles.name}>
					{firstName}, {age}
				</div>
				{/*<div>{age}</div>*/}
			</div>
		)
	}
}

export default ProfileCard
