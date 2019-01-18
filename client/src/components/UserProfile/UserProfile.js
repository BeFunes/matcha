import React, {Component} from 'react';
import styles from './UserProfile.module.css'
import Lightbox from 'react-images';
import {currentDate, formatLastOnline, getAge, stillOnline} from "../../utils/date";
import LocationIcon from "@material-ui/icons/LocationOn"
import Dialog from "@material-ui/core/es/Dialog/Dialog";
import JobIcon from "@material-ui/icons/Work"
import CakeIcon from "@material-ui/icons/Cake"
import Online from "@material-ui/icons/Lens"
import OfflineIcon from "@material-ui/icons/AccountCircle"
import GenderIcon from "@material-ui/icons/Wc"
import FullHeart from '@material-ui/icons/Favorite'
import EmptyHeart from '@material-ui/icons/FavoriteBorder'
import ChatBubbleEmpty from '@material-ui/icons/ChatBubbleOutline'
import EditIcon from '@material-ui/icons/Edit'
import ChatBubbleFull from '@material-ui/icons/ChatBubble'
import Block from '@material-ui/icons/Block'
import {getUserDataQuery, relationsDataQuery} from "../../graphql/queries";
import {fetchGraphql} from "../../utils/graphql";
import {
	markProfileVisitedMutation, toggleBlockMutation, toggleLikeMutation, reportUser,
	startChatMutation
} from "../../graphql/mutations";
import {EMPTYAVATAR, SERVER} from "../../constants";
import Button from '@material-ui/core/Button';
import {toast} from 'react-toastify';
import {userInfoChangeSubscription} from "../../graphql/subscriptions";
import {graphql} from "react-apollo/index";

// const getRandomBackground = () => {
// 	const n = Math.floor(Math.random() * 999) + 1
// 	return `https://picsum.photos/800/150/?image=${n}`
// }

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
		report: false,
	}

	componentDidMount() {
		console.log("Component did mount")
		const token = localStorage.getItem('token')
		if (!token || typeof this.props.location.state === "undefined") {
			this.props.history.push('/')
			return
		}
		const id = this.props.location.state.id
		const isMe = this.props.location.state.me
		this.setState({token: token, isMe: isMe}, () => {
			if (!isMe) {
				this.getUserData(token, id)
				this.markProfileVisited(id, token)
			}
		})

	}

	componentDidUpdate() {
		const {user, me, id} = this.props.location.state
		if (user && me && this.state.user.id !== user.id) {
			this.setState({user: user, isMe: true})
		}
		if (!me && id !== this.state.user.id) {
			this.setState({user: {id: id}}, () => {
				this.getUserData(this.state.token, id)
			})
		}
	}

	startChat = () => {
		const query = startChatMutation(this.state.user.id)
		const cb = resData => {
			if (resData.errors) {
				throw new Error(resData.errors[0].message)
			}
			this.props.addNewConversation(resData.data.startChat)
			this.props.history.push({
				pathname: `/chat`,
				state: {openChat: resData.data.startChat.conversationName}
			})
		}
		fetchGraphql(query, cb, this.state.token)
	}

	goToChat = () => {
		this.props.history.push({
			pathname: `/chat`,
			state: {openChat: `${this.state.user.firstName} ${this.state.user.lastName}`}
		})
	}

	componentWillReceiveProps({data}) {
		const {user} = this.state
		if (!user) {
			return
		}
		if (!!data && !!data.userInfoChange && data.userInfoChange.sender === user.id) {
			const {onlineInfo, likeInfo} = data.userInfoChange
			if (onlineInfo !== null) {
				this.setState({
					user: {
						...user,
						online: onlineInfo,
						lastOnline: onlineInfo ? currentDate() : this.state.user.lastOnline
					}
				})
			}
			else if (likeInfo !== null) {
				this.setState({likeFrom: likeInfo})
			}
		}
	}

	markProfileVisited(id, token) {
		console.log("MARK PROFILE VISITED")
		const query = markProfileVisitedMutation(id)
		const cb = resData => {
			if (resData.errors) {
				throw new Error("Profile NOT marker as visited")
			}
		}
		fetchGraphql(query, cb, token)

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
			this.getRelationsData(token, id)
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

	renderButton = () => {
		if (this.state.isMe) {
			return this.state.isMe && <div>
				<Button variant="contained" onClick={this.onEditClick} size="small">
					<EditIcon/> Edit
				</Button>
			</div>
		}

		return <div>
			<Button variant="contained" onClick={this.onReportClick} size="small">
				<svg style={{width: 24, height: 24}}>
					<path fill="#000000" d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z"/>
				</svg>
				Report profile
			</Button>
		</div>
	}

	onEditClick = () => {
		this.props.history.push('/edit_profile')
	}


	reportDialog = () => {
		return <Dialog onClose={this.closeDialog} open={this.state.report}>
			<div style={{margin: 10}}>Are you sure you want to report this profile ?</div>
			<Button style={{margin: 10}} variant={"contained"}
			        color="secondary"
			        onClick={this.onReportValidation}>
				Report
			</Button>
		</Dialog>
	}

	onReportClick = () => {
		this.setState({report: true})
	}

	onReportValidation = () => {
		const query = reportUser(this.state.user.id)
		const cb = resData => {
			if (resData.errors) {
				throw new Error("Profile NOT marker as visited")
			}
			toast.success("User reported")
			this.setState({report: false})
		}
		fetchGraphql(query, cb, this.state.token)
	}
	closeDialog = () => {
		this.setState({report: false})
	}

	render() {
		const {firstName, gender, lastName, dob, lastOnline, orientation, online, address, interests, job, bio, profilePic, picture2, picture3, picture4, picture5} = this.state.user
		const formatPic = (pic) => pic && pic.substring(0, 7) === "images/" ? `${SERVER}/${pic}` : pic
		const images = [picture2, picture3, picture4, picture5].filter(x => !!x && x !== 'undefined')
		const imagesArray = [profilePic, ...images].map(x => ({src: formatPic(x)}))
		const isOnline = online && stillOnline(lastOnline)
		const getProfilePic = () => {
			const profileP = formatPic(profilePic)
			return typeof profileP !== 'undefined' ? profileP : EMPTYAVATAR
		}
		const orientations = {'F': 'woman', 'M': 'man', 'FM': "man or a woman"}
		const preference = orientations[orientation]
		const age = dob && getAge(dob)
		const renderLikeIcon = () =>
			this.state.likeTo
				? <FullHeart onClick={this.toggleLike} color={"error"}/>
				: <EmptyHeart onClick={this.toggleLike}/>
		const renderBlockIcon = () =>
			<Block onClick={this.toggleBlock} color={this.state.blockTo ? "primary" : "inherit"}/>
		const renderChatIcon = () =>
			this.state.user.chats
				? <ChatBubbleFull className={styles.chat} onClick={this.goToChat}/>
				: <ChatBubbleEmpty className={styles.chat} onClick={this.startChat}/>
		const iconStyle = {fontSize: 14, marginBottom: -2}
		const onlineIcon = isOnline ? <Online style={{...iconStyle, color: '#22a822'}}/> :
			<OfflineIcon style={{...iconStyle, color: 'black'}}/>
		const onlineText = isOnline ? 'Online' : `Last online: ${formatLastOnline(lastOnline)}`
		const myGender = this.props.location.state.userAgent.gender
		const myOrientation = this.props.location.state.userAgent.orientation
		const canShowActions = this.state.user && !!myGender && !!myOrientation && orientation && gender && orientation.includes(myGender) && myOrientation.includes(gender)

		return (

			<div className={styles.component}>
				{this.reportDialog()}
				{this.state.user &&
				<div className={styles.whitePage}>
					<div className={styles.header}>
						<div className={styles.pictureBlock}>
							<div className={styles.profilePicContainer}>
								<img className={styles.profilePic}
								     src={getProfilePic()}
								     onClick={this.openLightbox.bind(this, 0)}
								     alt={`${firstName}+${lastName}`}
								/>
							</div>
							{!this.state.isMe && !!canShowActions ?
								<div className={styles.actionBlocks}>
									<div className={styles.iconBlock}> {renderLikeIcon()} Like</div>
									<div className={styles.iconBlock}> {renderBlockIcon()} Block</div>
									{this.state.likeTo && this.state.likeFrom && !this.state.blockTo &&
									<div className={styles.iconBlock}> {renderChatIcon()} Chat</div>}
								</div> : null}
						</div>
						<div className={styles.infoBox}>
							<div className={styles.name}>{firstName} {lastName}</div>
							{!this.state.isMe && <div className={styles.minorInfo}>{onlineIcon} {onlineText} </div>}
							<div className={styles.minorInfo}><CakeIcon style={iconStyle}/> {age} years old</div>
							<div className={styles.minorInfo}><LocationIcon style={iconStyle}/> {address}</div>
							<div className={styles.minorInfo}><JobIcon style={iconStyle}/> {job} </div>
							<div className={styles.minorInfo}><GenderIcon style={iconStyle}/>{gender === 'M' ? " Man" : " Woman"} </div>
							<div className={styles.minorInfo}><EmptyHeart style={iconStyle}/> Looking for a {preference} </div>
						</div>
						{this.renderButton()}
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
									<div className={styles.picContainer} key={i}>
										<img className={styles.pic}
										     src={formatPic(x)}
											   key={i}
											   onClick={this.openLightbox.bind(this, (i + 1))}
										     alt={x}
										/>
									</div>
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

export default (graphql(userInfoChangeSubscription, {
	options: () => ({
		variables: {
			userId: parseInt(localStorage.getItem('userId'))
		},
	})
})(UserProfile))
