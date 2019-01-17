import React, {Component} from 'react';
import styles from './Display.module.css'
import ProfileCard from "./ProfileCard/ProfileCard";
import Route from "react-router-dom/es/Route";
import {graphql} from "react-apollo/index";
import {userInfoChangeSubscription} from "../../../graphql/subscriptions";
import {currentDate} from "../../../utils/date";


class Display extends Component {
	state = {}

	componentDidMount() {
		this.setState({profiles: this.props.profiles})
	}

	componentDidUpdate(prevProps) {
		if (this.props.profiles !== prevProps.profiles) {
			this.setState({profiles: this.props.profiles})
		}
	}

	componentWillReceiveProps({data}) {
		if (!this.state.profiles) {
			return
		}
		if (!!data && !!data.userInfoChange) {
			const {likeInfo, onlineInfo, sender} = data.userInfoChange
			let newProfiles = this.state.profiles
			if (likeInfo !== null)
				newProfiles = this.state.profiles.map(x => x.id === sender ? {...x, likeFrom: likeInfo} : x)
			else if (onlineInfo !== null)
				newProfiles = this.state.profiles.map(x => x.id === sender ? {
					...x,
					online: onlineInfo,
					lastOnline: onlineInfo ? currentDate() : x.lastOnline
				} : x)
			this.setState({profiles: newProfiles})
		}
	}

	blockUser = (userId) => {
		const newProfiles = this.state.profiles.map(x => x.id === userId ? {...x, blocked: !x.blocked} : x)
		this.setState({profiles: newProfiles})
	}

	toggleLike = (id) => {
		const newProfiles = this.state.profiles.map(x => x.id === id ? {...x, likeTo: !x.likeTo } : x)
		this.setState({profiles: newProfiles})
	}

	render() {
		const {token, allowBlocked} = this.props
		const {profiles} = this.state
		const filteredProfiles = profiles && profiles[0] && profiles.filter(x => !x.blocked || allowBlocked)

		return (
			<div className={styles.component}>
				{filteredProfiles && <div className={styles.scrolling}>
					{filteredProfiles.map((item, index) => (
						<Route
							key={`${item.firstName}+${item.lastName}+${index}`}
							render={(props) => <ProfileCard
								addNewConversation={this.props.addNewConversation}
								profile={item}
								user={this.props.user}
								token={token}
								onBlock={this.blockUser}
								onToggleLike={this.toggleLike}
								{...props}
							/>}/>
					))}
				</div>}
				{filteredProfiles && <div className={styles.padding}>something</div>}
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
})(Display))
