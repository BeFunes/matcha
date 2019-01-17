import React, {Component} from 'react';
import styles from './ProfileCard.module.css'
import classnames from 'classnames';
import FullHeart from '@material-ui/icons/Favorite'
import EmptyHeart from '@material-ui/icons/FavoriteBorder'
import ChatBubbleEmpty from '@material-ui/icons/ChatBubbleOutline'
import ChatBubbleFull from '@material-ui/icons/ChatBubble'
import FameStar from '@material-ui/icons/Star'
import Block from '@material-ui/icons/Block'
import {fetchGraphql} from "../../../../utils/graphql";
import {startChatMutation, toggleBlockMutation, toggleLikeMutation} from "../../../../graphql/mutations";
import 'react-toastify/dist/ReactToastify.css';
import {stillOnline} from "../../../../utils/date";
import {EMPTYAVATAR, SERVER} from "../../../../constants";


class ProfileCard extends Component {
	_isMounted = false

	state = {
		likeTo: null,
		likeFrom: null
	}

	componentDidMount() {
		this._isMounted = true;
		if (this.props.profile) {
			this.setState({likeFrom: this.props.profile.likeFrom, likeTo: this.props.profile.likeTo})
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	componentWillReceiveProps(props) {
		if (props.profile && (this.state.likeTo !== props.likeTo || this.state.likeFrom !== props.likeFrom)) {
			this.setState({likeFrom: props.profile.likeFrom, likeTo: props.profile.likeTo})
		}
	}

	toggleLike = () => {
		const query = toggleLikeMutation(this.props.profile.id, !this.state.likeTo)
		const cb = resData => {
			if (resData.errors) {
				throw new Error(resData.errors[0].message)
			}
			if (this._isMounted) {
				this.props.onToggleLike(this.props.profile.id)
			}
		}
		fetchGraphql(query, cb, this.props.token)
	}


	startChat = () => {
		const query = startChatMutation(this.props.profile.id)
		const cb = resData => {
			if (resData.errors) {
				throw new Error(resData.errors[0].message)
			}
			this.props.addNewConversation(resData.data.startChat)
			this.props.history.push({
				pathname: `/chat`,
				state: { openChat: resData.data.startChat.conversationName }
			})
		}
		fetchGraphql(query, cb, this.props.token)
	}

	goToChat = () => {
		this.props.history.push({
			pathname: `/chat`,
			state: { openChat: `${this.props.profile.firstName} ${this.props.profile.lastName}`}
		})
	}

	blockUser = () => {
		const { blocked }  = this.props.profile
		const query = toggleBlockMutation(this.props.profile.id, !blocked)
		const cb = resData => {
			if (resData.errors) {
				throw new Error(resData.errors[0].message)
			}
			console.log("user block toggled successfully")
			this.props.onBlock(this.props.profile.id)
		}
		fetchGraphql(query, cb, this.props.token)
	}

	render() {
		const {firstName, lastName, age, profilePic, gender, id, online, lastOnline, fameRating} = this.props.profile
		const chat = this.state.likeFrom && this.state.likeTo
		const borderStyle = gender === 'F' ? styles.f : styles.m

		const getProfilePic = () => {
			if (!profilePic) return null
			const profileP = profilePic && profilePic.substring(0, 7) === "images/" ? `${SERVER}/${profilePic}` : profilePic
			return typeof profileP !== 'undefined' ? profileP : EMPTYAVATAR
		}

		const renderHeart = () => {
			return (this.state.likeTo)
				? <FullHeart onClick={this.toggleLike}/>
				: <EmptyHeart onClick={this.toggleLike}/>
		}

		const renderChat = () => {
			return (this.props.profile.chats > 0)
				? <ChatBubbleFull onClick={this.goToChat}/> : <ChatBubbleEmpty onClick={this.startChat}/>
		}

		const renderBlock = () =>
			<Block onClick={this.blockUser} color={this.props.profile.blocked ? "error" : "inherit"}/>


		return (
			<div className={classnames(styles.component, borderStyle)}>
				<div className={styles.imgContainer}>
					<img src={getProfilePic()}
					     alt={`${firstName}_${lastName}`}
					     className={styles.img}
					     onClick={() => {
						     this.props.history.push({
							     pathname: `/user_profile`,
							     search: '',
							     state: {id: id}
						     })
					     }}/>
				</div>


					<div className={styles.fameOnline}>
						<div className={styles.fame}>
							<FameStar className={styles.starIcon}/> {fameRating}
						</div>
						<div>{online && stillOnline(lastOnline) &&  <div className={styles.onlineSymbol}/>}</div>
				</div>
				<div className={styles.icons}>
					{renderHeart()}
					{chat && renderChat()}
					{renderBlock()}
				</div>
				<div className={styles.name}>
					{firstName}, {age}
				</div>
			</div>
		)
	}
}

export default ProfileCard
