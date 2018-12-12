import React, {Component} from 'react';
import styles from './ProfileCard.module.css'
import classnames from 'classnames';

class ProfileCard extends Component {
	render() {
		const { firstName, age, lastName, profilePic, gender } = this.props.profile
		const borderStyle = gender === 'F' ? styles.f : styles.m
		return (
			<div className={classnames(styles.component, borderStyle)}>
				<div>
					<img
						className={styles.img}
						src={profilePic}
						alt={`${firstName}-${lastName}`} />

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
