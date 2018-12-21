import React from 'react'
import styles from './Toolbar.module.css'
import NavigationItems from "../NavigationItems/NavigationItems";
import {Route} from 'react-router-dom';

const toolbar = (props) => {
	const {onLogout, onProfileClick, user} = props
	return (
		<header className={styles.toolbar}>

			{/*<Logo />*/}
			<nav>
				<Route render={(props) =>  <NavigationItems  {...props} onLogout={onLogout} user={user} onProfileClick={onProfileClick} />}/>
			</nav>
			<div onClick={onLogout}>Logout</div>
		</header>
	)
}

export default toolbar