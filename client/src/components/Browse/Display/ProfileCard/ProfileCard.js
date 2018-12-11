import React, {Component} from 'react';
import styles from './ProfileCard.module.css'
import classnames from 'classnames';
import {getAge} from "../../../../utils/date";


class ProfileCard extends Component {
	render() {
		const { firstName, dob, lastName, profilePic, gender } = this.props.profile
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
				<div>{getAge(dob)}</div>
			</div>
		)
	}
}

export default ProfileCard
