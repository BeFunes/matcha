import React, {Component} from 'react';
import styles from './Display.module.css'
import ProfileCard from "./ProfileCard/ProfileCard";

class Display extends Component {
	render() {
		const { profiles } = this.props
		return (
			<div className={styles.component}>
				{profiles && profiles.map((item) => (
					<ProfileCard
						key={`${item.firstName}+${item.lastName}`}
						profile={item}
					/>
				))}
			</div>
		)
	}
}

export default Display
