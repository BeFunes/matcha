import React, {Component} from 'react';
import styles from './Messages.module.css'
import Bubble from "./Bubble/Bubble";

class Messages extends Component {

	render() {
		const { messages } = this.props
		return (
			<div className={styles.component}>
				{messages && messages.length &&
				messages.map((x, i) => (
					<Bubble
						key={i}
						content={x.content}
						fromYou={x.senderId === parseInt(localStorage.getItem('userId'))}
					/>
				))}
			</div>
		)
	}
}

export default Messages
