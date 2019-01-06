import React, {Component} from 'react';
import List from "@material-ui/core/es/List/List";
import ListItem from "@material-ui/core/es/ListItem/ListItem";
import ListItemText from "@material-ui/core/es/ListItemText/ListItemText";
import styles from './ChatList.module.css'
import ListItemSecondaryAction from "@material-ui/core/es/ListItemSecondaryAction/ListItemSecondaryAction";
import filter from 'lodash/filter'

class ChatList extends Component {


	render() {
		const {conversations, currentConversation } = this.props
		const countUnread = (messages) => filter(messages, x => !x.seen).length;
		const style = (x) => ({
			borderBottom: "1px solid white",
			backgroundColor: x.name === currentConversation ? '#f2dff5' : '#f1f1f5'
		})

		return (
			<List className={styles.component}>
				{conversations && conversations.map((x, i) => (
					<ListItem
						button
						key={i}
						style={style(x)}
						onClick={this.props.onChatSelect.bind(this, x.name)}
					>
						<ListItemText
							primary={x.name}
							secondary={x.messages[0].timestamp}
						/>
						<ListItemSecondaryAction>
							{countUnread(x.messages) > 0 && (<div className={styles.unreadBadge}>{countUnread(x.messages)} </div>) }
						</ListItemSecondaryAction>

					</ListItem>
				))}
			</List>
		)
	}
}

export default ChatList
