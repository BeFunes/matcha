import React, {Component} from 'react';
import styles from './Display.module.css'
import ProfileCard from "./ProfileCard/ProfileCard";
import _ from "lodash"

class Display extends Component {
	state = {
	}

	componentDidMount () {
		this.setState({profiles: this.props.profiles})
	}

	componentDidUpdate (prevProps) {
		if (this.props.profiles !== prevProps.profiles) {
			this.setState({profiles: this.props.profiles})
		}
	}

	blockUser = (userId) => {
		const newProfiles = this.state.profiles.map(x => x.id === userId ? {...x, blocked: !x.blocked} : x)
		this.setState({profiles: newProfiles})
	}

	render() {
		const { token, allowBlocked } = this.props
		const { profiles } = this.state
		const filteredProfiles = profiles && profiles[0] && profiles.filter(x => !x.blocked || allowBlocked)

		return (
			<div className={styles.component}>
				{filteredProfiles && filteredProfiles.map((item, index) => (
					<ProfileCard
						key={`${item.firstName}+${item.lastName}+${index}`}
						profile={item}
						token={token}
						onBlock={this.blockUser}
					/>
				))}
			</div>
		)
	}
}

export default Display
