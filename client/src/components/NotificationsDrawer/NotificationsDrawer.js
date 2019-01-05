import React from 'react'
import styles from './NotificationsDrawer.module.css'
import Notifications from "./Notifications/Notifications";
import Drawer from "@material-ui/core/es/Drawer/Drawer";
import withStyles from "@material-ui/core/es/styles/withStyles";

const drawerWidth = 301

const drawerStyle = theme => ({
	root: {
		display: 'flex',
	},
	// appBar: {
	// 	transition: theme.transitions.create(['margin', 'width'], {
	// 		easing: theme.transitions.easing.sharp,
	// 		duration: theme.transitions.duration.leavingScreen,
	// 	}),
	// },
	// appBarShift: {
	// 	width: `calc(100% - ${drawerWidth}px)`,
	// 	marginLeft: drawerWidth,
	// 	transition: theme.transitions.create(['margin', 'width'], {
	// 		easing: theme.transitions.easing.easeOut,
	// 		duration: theme.transitions.duration.enteringScreen,
	// 	}),
	// },
	menuButton: {
		marginLeft: 12,
		marginRight: 20,
	},
	hide: {
		display: 'none',
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
	},
	drawerPaper: {
		width: drawerWidth,
	},
	drawerHeader: {
		display: 'flex',
		alignItems: 'center',
		padding: '0 8px',
		...theme.mixins.toolbar,
		justifyContent: 'flex-end',
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing.unit * 3,
		transition: 'none',
		marginLeft: -drawerWidth,
	},
	// contentShift: {
	// 	transition: theme.transitions.create('margin', {
	// 		easing: theme.transitions.easing.easeOut,
	// 		duration: theme.transitions.duration.enteringScreen,
	// 	}),
	// 	marginLeft: 0,
	// },
});


const NotificationsDrawer = (props) => {
	const {open, close} = props
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
			something
			<Notifications
				close={close}
			/>
		</Drawer>
	)
}

export default withStyles(drawerStyle, { withTheme: true })(NotificationsDrawer);
