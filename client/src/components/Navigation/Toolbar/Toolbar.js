import React from 'react'
import styles from './Toolbar.module.css'
import NavigationItems from "../NavigationItems/NavigationItems";

const toolbar = (props) => {
	const {onLogout} = props
	return (
		<header className={styles.toolbar}>

			{/*<Logo />*/}
			<nav>
				<NavigationItems onLogout={onLogout} />
			</nav>
			<div onClick={onLogout}>Logout</div>
		</header>
	)
}

export default toolbar