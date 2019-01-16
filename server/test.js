import {startChatMutation, toggleBlockMutation, toggleLikeMutation} from "../client/src/graphql/mutations";
import {EMPTYAVATAR, HOST} from "../client/src/constants";
import {stillOnline} from "../client/src/utils/date";
import {fetchGraphql} from "../client/src/utils/graphql";

const jwt = require('jsonwebtoken')

const token = jwt.sign(
	{email: "benedetta.dalcanton@gmail.com"},
	"🍗🍡⏰",
	{expiresIn: 1}
)

console.log(token)


const something = () => {

	let decodedToken;
	try {
		decodedToken = jwt.verify(token, '🍗🍡⏰');
	} catch (err) {
		console.log(err.message)
		const payload = jwt.verify(token, '🍗🍡⏰', {ignoreExpiration: true})
		console.log(payload)
	}
}
setTimeout(something, 3000)




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
		if (props.profile && this.state.likeTo === null) {
			this.setState({likeFrom: props.profile.likeFrom, likeTo: this.props.profile.likeTo})
		}
	}

	toggleLike = () => {
		const query = toggleLikeMutation(this.props.profile.id, !this.state.likeTo)
		const cb = resData => {
			if (resData.errors) {
				throw new Error(resData.errors[0].message)
			}
			if (this._isMounted) {
				this.setState({likeTo: !this.state.likeTo})
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

		const {firstName, age, profilePic, gender, id, online, lastOnline} = this.props.profile
		if (id === 4) {
			console.log(this.props.profile)
		}
		const chat = this.state.likeFrom && this.state.likeTo
		const borderStyle = gender === 'F' ? styles.f : styles.m


		const getProfilePic = () => {
			if (!profilePic) return null
			const profileP = profilePic && profilePic.substring(0, 7) === "images/" ? `${HOST}/${profilePic}` : profilePic
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
						<FameStar className={styles.starIcon}/> 7767
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
