import React, {Component} from 'react';
import styles from './Reply.module.css'
import Button from "@material-ui/core/es/Button/Button";
import TextField from "@material-ui/core/es/TextField/TextField";
import Send from '@material-ui/icons/Send'


class Reply extends Component {
	state = {
		reply: ''
	}

	onReplyChange = ({target}) => {
		this.setState({reply: target.value})
	}

	onPressSend = () => {
		const sanitisedReply = JSON.stringify(this.state.reply.trim())
		this.props.sendReply(sanitisedReply, this.props.receiverId)
		this.setState({reply: ''})
	}

	onKeyDown = (event) => {
		const {blockedByUsers, blockedUsers } = this.props
		const id = this.props.receiverId
		const blocked = (blockedUsers && (blockedByUsers.includes(id) || blockedByUsers === id)) || (blockedUsers && (blockedUsers.includes(id) || blockedUsers === id))
		if (event.key === 'Enter') {
			if (!this.state.reply.trim().length || blocked ) { return }
			this.onPressSend()
			event.preventDefault()
		}

	}

	render() {
		const {blockedByUsers, blockedUsers } = this.props
		const id = this.props.receiverId
		const blocked = (blockedUsers && (blockedByUsers.includes(id) || blockedByUsers === id)) || (blockedUsers && (blockedUsers.includes(id) || blockedUsers === id))
			return (
			<div className={styles.component}>
				<TextField
					multiline
					rowsMax="6"
					rows="3"
					value={!blocked ? this.state.reply : "        **** this user blocked you or you blocked them ****"}
					onChange={this.onReplyChange}
					className={styles.input}
					style={{margin: 15}}
					variant="outlined"
					onKeyDown={this.onKeyDown}
				/>
				<Button
					onClick={this.onPressSend}
					disabled={!this.state.reply.trim().length || blocked}
				>
					<Send/>
				</Button>
			</div>
		)
	}
}

export default Reply
