import React, {Component} from 'react';
import ChatList from "./ChatList/ChatList";
import styles from './Chat.module.css'
import ChatBody from "./ChatBody/ChatBody";
import {sendMessageMutation} from "../../graphql/mutations";
import {fetchGraphql} from "../../utils/graphql";

class Chat extends Component {

	state = {}

	componentDidMount() {
		if (this.props.conversations) {
			this.setState({currentConversation: this.props.conversations[0].name, conversations: this.props.conversations})
		}
	}

	sendReply = (content, receiverId) => {
		const query = sendMessageMutation(content, receiverId)
		console.log(query)
		const cb = resData => {
			if (resData.errors) {
				throw new Error(resData.errors[0].message)
			}
			const newMessage = {
				content: content.substring(1, content.length-1),
				receiverId: receiverId,
				senderId: parseInt(localStorage.getItem('userId')),
				seen: true,
				timeStamp: new Date()
			}
			console.log(this.state.conversations)
			const rightConv = this.state.conversations.find(x => x.id === receiverId)
			const newConv = {...rightConv, messages: [...rightConv.messages, newMessage]}
			const newConversations = this.state.conversations.map(x => x.id === receiverId ? newConv : x)
			this.setState({conversations: newConversations})
		}
		fetchGraphql(query, cb, this.props.token)
	}

	onChatSelect = (name) => {
		this.setState({currentConversation: name})
	}

	componentWillReceiveProps({conversations}) {
		// if (conversations && this.state.currentConversation !== conversations[0].name)
		// 	this.setState({currentConversation: conversations[0].name})
		if (conversations && this.state.conversations !== conversations)
			this.setState({conversations: conversations}, () => {
				if (conversations && this.state.currentConversation !== conversations[0].name)
					this.setState({currentConversation: conversations[0].name})
			})

	}

	render() {
		const {conversations} = this.state
		const currentConversationWithContent = conversations && conversations.find(x => x.name === this.state.currentConversation)
		return (
			<div className={styles.component}>
				<ChatList
					classNAme={styles.list}
					conversations={conversations}
					onChatSelect={this.onChatSelect}
					currentConversation={this.state.currentConversation}
				/>
				<ChatBody
					className={styles.listBody}
					sendReply={this.sendReply}
					currentConversation={currentConversationWithContent}
				/>
			</div>
		)
	}
}

export default Chat
