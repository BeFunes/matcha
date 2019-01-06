import React, {Component} from 'react';
import ChatList from "./ChatList/ChatList";
import styles from './Chat.module.css'
import ChatBody from "./ChatBody/ChatBody";

class Chat extends Component {

	state = {}


	onChatSelect = (name) => {
		this.setState({currentConversation : name})
	}

	componentWillReceiveProps ({conversations}) {
		if (conversations && this.state.currentConversation !== conversations[0].name)
			this.setState({currentConversation: conversations[0].name})
	}

	render() {
		const { conversations } = this.props
		const currentConversation = conversations && conversations.find( x => x.name === this.state.currentConversation)
		return (
			<div className={styles.component}>
				<ChatList
					classNAme={styles.list}
					conversations={conversations}
					onChatSelect={this.onChatSelect}
				/>
				<ChatBody
					className={styles.listBody}
					currentConversation={currentConversation && currentConversation.messages}
				/>
			</div>
		)
	}
}

export default Chat
