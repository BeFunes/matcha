import React, {Component} from 'react'
import styles from './Notifications.module.css'
import CloseIcon from "@material-ui/icons/Close"
import ListItem from "@material-ui/core/es/ListItem/ListItem";
import ListItemText from "@material-ui/core/es/ListItemText/ListItemText";
import List from "@material-ui/core/es/List/List";
import withStyles from "@material-ui/core/es/styles/withStyles";

const listTextStyle = () => ({
	listItemText:{
		fontSize:'15px',//Insert your required size
	},
	secondaryText: {
		fontSize: '12px',
		color: 'grey',
		// textAlign: 'right'
	}
});


class Notifications extends Component {

	closeAndMarkAllAsSeen = () => {
		this.props.markNotificationsAsSeen()
		this.props.close()
	}

	render() {
		const {notifications} = this.props
		const cellBackground = (x) => !!x.seen ? '#ECECEC' : '#ffe4e8'
		const text = (name) => ({
			"match" : <div>You matched with <h4>{name}</h4></div>,
			"like" : <div><h4>{name}</h4> liked you</div>,
			"unmatch" : <div>You unmatched with <h4>{name}</h4></div>
		})

		return (
			<div className={styles.component}>
				<div className={styles.header}>
					<div className={styles.closeIcon} onClick={this.closeAndMarkAllAsSeen}>
							<CloseIcon style={{fontSize: 30}}/>
					</div>
					Notifications
				</div >
				{notifications && <List className={styles.list} >
					{notifications.map((x, i) => (
						<ListItem button key={i}
						          style={{borderBottom: "1px solid white", backgroundColor: cellBackground(x)}}
						>
							<ListItemText
								classes={{primary: this.props.classes.listItemText,
													secondary: this.props.classes.secondaryText}}
								primary={text(x.senderName)[x.type]}
								secondary={x.createdAt}
							/>
						</ListItem>
					))}
				</List>}
			</div>
		)
	}
}

export default withStyles(listTextStyle, { withTheme: true })(Notifications);
