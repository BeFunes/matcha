import React, {Component} from 'react';
import styles from './ChatBody.module.css'
import Messages from "./Messages/Messages";
import Reply from "./Reply/Reply";

class ChatBody extends Component {

	render() {
		const { currentConversation, sendReply, userId } = this.props
		return (
			<div className={styles.component}>
				<Messages
					messages={currentConversation && currentConversation.messages}
					userId={userId}
				/>
				<Reply
					blockedByUsers={this.props.blockedByUsers}
					blockedUsers={this.props.blockedUsers}
					receiverId={currentConversation && currentConversation.id}
					sendReply={sendReply}
				/>
			</div>
		)
	}
}

export default ChatBody
