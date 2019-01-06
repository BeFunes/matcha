import React, {Component} from 'react';
import styles from './ChatBody.module.css'
import Messages from "./Messages/Messages";
import Reply from "./Reply/Reply";

class ChatBody extends Component {

	render() {
		const { currentConversation, sendReply } = this.props
		return (
			<div className={styles.component}>
				<Messages
					messages={currentConversation && currentConversation.messages}
				/>
				<Reply
					receiverId={currentConversation && currentConversation.id}
					sendReply={sendReply}
				/>
			</div>
		)
	}
}

export default ChatBody
