import React, {Component} from 'react'
import styles from './Notifications.module.css'
import IconButton from "@material-ui/core/es/IconButton/IconButton";
import CloseIcon from "@material-ui/icons/Close"
import Divider from "@material-ui/core/es/Divider/Divider";
import ListItem from "@material-ui/core/es/ListItem/ListItem";
import ListItemText from "@material-ui/core/es/ListItemText/ListItemText";
import List from "@material-ui/core/es/List/List";

class Notifications extends Component {

	render() {
		const {close} = this.props
		return (
			<div className={styles.component}>
				<div className={styles.header}>
					<div className={styles.closeIcon}>
						<IconButton onClick={close}>
							<CloseIcon/>
						</IconButton>
					</div>
					Notifications
				</div>
				{/*<Divider/>*/}
				<List>
					{['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
						<ListItem button key={text}>
							<ListItemText primary={text}/>
						</ListItem>
					))}
				</List>
			</div>
		)
	}
}

export default Notifications

