import React from 'react'
import styles from './Toolbar.module.css'
import NavigationItems from "../NavigationItems/NavigationItems";
import {Route} from 'react-router-dom';
import NotificationIcon from '@material-ui/icons/Notifications';
import LogOutIcon from '@material-ui/icons/PowerSettingsNew';


const toolbar = (props) => {
	const {onLogout, user} = props
	const iconColor = 1 === false ? 'white' : 'yellow'
	return (
		<header className={styles.toolbar}>

			{/*<Logo />*/}
			<div style={{color: iconColor}} className={styles.notificationIcon}>
				< NotificationIcon style={{ fontSize: 35, marginBottom: -8}}/>
				<div className={styles.newNotification}  />
			</div>
			<nav style={{flex: 1}}>
				<Route render={(props) => <NavigationItems  {...props} onLogout={onLogout} user={user}/>}/>
			</nav>
			<LogOutIcon onClick={onLogout} />
		</header>
	)
}

export default toolbar