import React from 'react'
import styles from './Toolbar.module.css'
import NavigationItems from "../NavigationItems/NavigationItems";
import {Route} from 'react-router-dom';
import NotificationIcon from '@material-ui/icons/Notifications';
import LogOutIcon from '@material-ui/icons/PowerSettingsNew';
import Badge from "@material-ui/core/es/Badge/Badge";

import { withStyles } from '@material-ui/core/styles';


const badgeStyle = theme => ({
	badge: {
		top: -1,
		right: -8,
	},
});

const Toolbar = (props) => {
	const {onLogout, user} = props
	const iconColor = 1 === false ? 'white' : 'yellow'
	return (
		<header className={styles.toolbar}>

			{/*<Logo />*/}
			<div style={{color: iconColor}} className={styles.notificationIcon}>
			<Badge color="primary" badgeContent={4} classes={{ badge: props.classes.badge }} invisible={false}>
				< NotificationIcon style={{fontSize: 35}}/>
			</Badge>
			</div>


			<nav style={{flex: 1}}>
				<Route render={(props) => <NavigationItems  {...props} onLogout={onLogout} user={user}/>}/>
			</nav>
			<div className={styles.logoutIcon} >
				<LogOutIcon style={{fontSize: 30}} onClick={onLogout}/>
			</div>
		</header>
	)
}

// export default Toolbar
export default withStyles(badgeStyle)(Toolbar);
