import React from 'react';
import styles from './NavigationItems.module.css'

const navigationItems = () => (
	<ul className={styles.navigationItems}>
		<li className={styles.item}><a href="/">Browse</a></li>
		<li className={styles.item}><a href="/">Profile</a></li>
		<li className={styles.item}><a href="/">Logout</a></li>
	</ul>
)

export default navigationItems