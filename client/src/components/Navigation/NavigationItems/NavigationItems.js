import React from 'react';
import styles from './NavigationItems.module.css'
import Link from "react-router-dom/es/Link";

const navigationItems = (props) => {
	return (
		<ul className={styles.navigationItems}>
			<li className={styles.item}><Link to="/">Browse</Link></li>
			<li className={styles.item}><Link to="/user_profile">Profile</Link></li>
			<li className={styles.item}><Link to="/chat">Chat</Link></li>
		</ul>
	)
}

export default navigationItems