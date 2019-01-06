import React, {Component} from 'react';
import List from "@material-ui/core/es/List/List";
import ListItem from "@material-ui/core/es/ListItem/ListItem";
import ListItemText from "@material-ui/core/es/ListItemText/ListItemText";
import styles from './ChatList.module.css'

class ChatList extends Component {


	render() {
		const {conversations} = this.props
		return (
			<List className={styles.component}>
				{conversations && conversations.map((x, i) => (
					<ListItem
						button
						key={i}
						style={{borderBottom: "1px solid white"}}
						onClick={this.props.onChatSelect.bind(this, x.name)}
					>
						<ListItemText
							primary={x.name}
							secondary={x.messages[0].timestamp}
						/>
					</ListItem>
				))}
			</List>
		)
	}
}

export default ChatList
