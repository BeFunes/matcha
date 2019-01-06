import React, {Component} from 'react';
import styles from './ChatBody.module.css'
import Messages from "./Messages/Messages";
import Reply from "./Reply/Reply";

class ChatBody extends Component {

	render() {
		const { currentConversation } = this.props
		return (
			<div className={styles.component}>
				<Messages
					messages={currentConversation}
				/>
				<Reply />
			</div>
		)
	}
}

export default ChatBody
