import React, {Component} from 'react';
import styles from './UserProfile.module.css'
import Lightbox from 'react-images';
import {getAge} from "../../utils/date";
import LocationIcon from "@material-ui/icons/LocationOn"
import JobIcon from "@material-ui/icons/Work"
import FullHeart from '@material-ui/icons/Favorite'
import EmptyHeart from '@material-ui/icons/FavoriteBorder'
import ChatBubbleEmpty from '@material-ui/icons/ChatBubbleOutline'
import ChatBubbleFull from '@material-ui/icons/ChatBubbleOutline'
import Block from '@material-ui/icons/Block'
import {getUserDataQuery, relationsDataQuery} from "../../graphql/queries";
import {fetchGraphql} from "../../utils/graphql";
import {toggleBlockMutation, toggleLikeMutation} from "../../graphql/mutations";
import {HOST} from "../../constants";

const emptyAvatar = 'https://us.123rf.com/450wm/pikepicture/pikepicture1612/pikepicture161200524/68824656-male-default-placeholder-avatar-profile-gray-picture-isolated-on-white-background-for-your-design-ve.jpg?ver=6'

const getRandomBackground = () => {
	const n = Math.floor(Math.random() * 999) + 1
	return `https://picsum.photos/800/150/?image=${n}`
}

class UserProfile extends Component {
	state = {
		user: {},
		authUser: {},
		likeTo: false,
		likeFrom: false,
		blockTo: false,
		blockFrom: false,
		chatStarted: false,
		isMe: false,
	}

	componentDidMount() {
		const token = localStorage.getItem('token')
		if (!token || typeof this.props.location.state === "undefined") {
			this.props.history.push('/')
			return
		}
		const id = this.props.location.state.id
		const isMe = !!this.props.location.state.me
		this.setState({token: token , isMe: isMe}, () => {
			!isMe && this.getUserData(token, id)
			!isMe && this.getRelationsData(token, id)
		})
		
	}

	componentDidUpdate() {
		if (this.state.user.id !== this.props.location.state.user.id && this.props.location.state.me) {
			this.setState({user: this.props.location.state.user, isMe: true})
		}
	}

	getUserData = (token, id) => {
		console.log("GET USER DATA")
		const query = getUserDataQuery(id)
		const cb = resData => {
			if (resData.errors) {
				console.log(resData.errors[0].message)
				throw new Error("User data retrieval failed .")
			}
			this.setState({user: {...resData.data.getUserData}})
		}
		fetchGraphql(query, cb, token)
	}

	getRelationsData = (token, id) => {
		console.log("GET RELATIONS DATA")
		const query = relationsDataQuery(id)
		const cb = resData => {
			if (resData.errors) {
				throw new Error("Relations data retrieval failed .")
			}
			this.setState({...resData.data.relationsData})
		}
		fetchGraphql(query, cb, token)
	}

	openLightbox = (index) => {
		this.setState({lightboxIsOpen: true, currentImage: index})
	}

	closeLightbox = () => {
		this.setState({lightboxIsOpen: false})
	}
	gotoImage = (index) => {
		this.setState({currentImage: index})
	}
	previousImage = () => {
		this.setState({currentImage: this.state.currentImage - 1})
	}
	nextImage = () => {
		this.setState({currentImage: this.state.currentImage + 1})
	}

	toggleLike = () => {
		const query = toggleLikeMutation(this.state.user.id, !this.state.likeTo)
		const cb = resData => {
			if (resData.errors) {
				throw new Error(resData.errors[0].message)
			}
			console.log("like toggled")
			this.setState({likeTo: !this.state.likeTo})
		}
		fetchGraphql(query, cb, this.state.token)
	}

	toggleBlock = () => {
		const query = toggleBlockMutation(this.state.user.id, !this.state.blockTo)
		const cb = resData => {
			if (resData.errors) {
				throw new Error(resData.errors[0].message)
			}
			console.log("block toggled")
			this.setState({blockTo: !this.state.blockTo})
		}
		fetchGraphql(query, cb, this.state.token)
	}

	render() {
		
		const {firstName, lastName, dob, gender, orientation, address, interests, job, bio, profilePic, picture2, picture3, picture4, picture5} = this.state.user
		const images = [picture2, picture3, picture4, picture5].filter(x => !!x && x !== 'undefined')
		const imagesArray = [profilePic, ...images].map(x => ({src: x}))
		// const printableAddress = address && address.replace(/[0-9]/g, '')

		const getProfilePic = () => {
			const profileP = profilePic && profilePic.substring(0,7) === "images/" ? `${HOST}/${profilePic}` : profilePic
			return typeof profileP !== 'undefined' ? profileP : emptyAvatar
		}

		const age = dob && getAge(dob)
		const renderLikeIcon = () =>
			this.state.likeTo
				? <FullHeart onClick={this.toggleLike} color={"error"}/>
				: <EmptyHeart onClick={this.toggleLike}/>
		const renderBlockIcon = () =>
			<Block onClick={this.toggleBlock} color={this.state.blockTo ? "primary" : "inherit"}/>
		const renderChatIcon = () =>
			this.state.chatStarted
				? <ChatBubbleFull className={styles.chat}/>
				: <ChatBubbleEmpty className={styles.chat}/>

		return (
			<div className={styles.component}>
				{this.state.user &&

				<div className={styles.page}>
					<div className={styles.header}>
						<div className={styles.pictureBlock}>
						<img className={styles.profilePic}
						     src={getProfilePic()}
						     onClick={this.openLightbox.bind(this, 0)}
						     alt={`${firstName}+${lastName}`}
						/>
							{!this.state.isMe ? 
								<div className={styles.actionBlocks}>
									<div className={styles.iconBlock} > {renderLikeIcon()} Like</div>
									<div className={styles.iconBlock}> {renderBlockIcon()} Block</div>
									{this.state.likeTo && this.state.likeFrom && !this.state.blockTo &&
									<div className={styles.iconBlock}> {renderChatIcon()} Chat</div>}
							</div> : null}
						</div>
						<div className={styles.infoBox}>
							<div className={styles.name}>{firstName} {lastName}</div>
							<div className={styles.minorInfo}> {age} years old</div>
							<div className={styles.minorInfo}><LocationIcon style={{fontSize: 15}}/> {address}</div>
							<div className={styles.minorInfo}><JobIcon style={{fontSize: 15}}/> {job} </div>
						</div>
					</div>


					<div className={styles.body}>
						<div className={styles.title}> Bio</div>
						<div>{bio}</div>
					</div>
					<div className={styles.body}>
						<div className={styles.title}>Interests</div>
						<ul>
							{interests && interests.map(x => <li key={x}>{x}</li>)}
						</ul>
					</div>

					<div className={styles.body}>
						<div className={styles.title}> Photos</div>

						{!images.length
							? "No photos added"
							: <div className={styles.photos}>
								{images.map((x, i) =>
									<div className={styles.pic}
									     style={{backgroundImage: `url(${x})`}}
									     key={i}
									     onClick={this.openLightbox.bind(this, (i + 1))}
									/>
								)}
								<Lightbox
									currentImage={this.state.currentImage}
									images={imagesArray}
									isOpen={this.state.lightboxIsOpen}
									onClose={this.closeLightbox}
									onClickThumbnail={this.gotoImage}
									onClickNext={this.nextImage}
									onClickPrev={this.previousImage}
								/>
							</div>
						}
					</div>
				</div>
				}

			</div>
		)
	}
}

export default UserProfile

