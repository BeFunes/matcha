import React from 'react'
import styles from './NotificationsDrawer.module.css'
import Notifications from "./Notifications/Notifications";
import Drawer from "@material-ui/core/es/Drawer/Drawer";
import withStyles from "@material-ui/core/es/styles/withStyles";

const drawerWidth = 301

const drawerStyle = theme => ({
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
	},
	drawerPaper: {
		width: drawerWidth,
	},
});


const NotificationsDrawer = (props) => {
	const {open, close, notifications, markNotificationsAsSeen} = props
	return (
		<Drawer
			className={styles.component}
			variant="persistent"
			anchor="left"
			open={open}
			classes={{
				paper: props.classes.drawerPaper,
			}}
		>
			<Notifications
				close={close}
				notifications={notifications}
				markNotificationsAsSeen={markNotificationsAsSeen}
			/>
		</Drawer>
	)
}

export default withStyles(drawerStyle, { withTheme: true })(NotificationsDrawer);
