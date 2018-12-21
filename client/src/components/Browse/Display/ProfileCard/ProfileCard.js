import React, {Component} from 'react';
import styles from './ProfileCard.module.css'
import classnames from 'classnames';
import FullHeart from '@material-ui/icons/Favorite'
import EmptyHeart from '@material-ui/icons/FavoriteBorder'
import ChatBubbleEmpty from '@material-ui/icons/ChatBubbleOutline'
import ChatBubbleFull from '@material-ui/icons/ChatBubbleOutline'
import Block from '@material-ui/icons/Block'
import {likeInfoQuery } from "../../../../graphql/queries";
import {fetchGraphql} from "../../../../utils/graphql";
import {toggleBlockMutation, toggleLikeMutation} from "../../../../graphql/mutations";
import {Route} from 'react-router-dom';
import UserProfile from '../../../UserProfile/UserProfile'


class ProfileCard extends Component {

	state = {
		likeTo: false,
		likeFrom: false
	}

	componentDidMount() {
		this.getLikeInfo()
	}

	toggleLike = () => {
		const query = toggleLikeMutation(this.props.profile.id, !this.state.likeTo)
		const cb = resData => {
			if (resData.errors) {
				throw new Error(resData.errors[0].message)
			}
			// console.log(resData.data.toggleLike.content)
			this.setState({likeTo: !this.state.likeTo})
		}
		fetchGraphql(query, cb, this.props.token)
	}

	getLikeInfo = () => {
		const query = likeInfoQuery(this.props.profile.id)
		const cb = resData => {
			if (resData.errors) {
				throw new Error(resData.errors[0].message)
			}
			// console.log(resData.data.likeInfo)
			if (this.props.profile.id === 4) {
				console.log(resData.data.likeInfo)
			}
			const {likeTo, likeFrom} = resData.data.likeInfo
			this.setState({likeTo: likeTo, likeFrom: likeFrom})
		}
		fetchGraphql(query, cb, this.props.token)
	}

	blockUser = () => {
		const query = toggleBlockMutation(this.props.profile.id, !this.state.blocked)
		const cb = resData => {
			if (resData.errors) {
				throw new Error(resData.errors[0].message)
			}
			console.log("user block toggled successfully")
			// this.setState({blocked: !this.state.blocked})
			this.props.onBlock(this.props.profile.id)
		}
		fetchGraphql(query, cb, this.props.token)
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
					 onClick={() => {this.props.history.push({ 
						 pathname: `/user_profile`, 
						 search: '',
						 state : { user: this.props.user , id: `${id}` }
					 })}}

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
