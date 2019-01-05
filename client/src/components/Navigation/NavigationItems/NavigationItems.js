import React, { Component} from 'react'
import styles from './NavigationItems.module.css'
import Link from "react-router-dom/es/Link";

class navigationItems extends Component {

	onClick = () => {
		console.log("CALLED")
		this.props.history.push({
			pathname: `/user_profile`,
			search: '',
		})
	}

	render() {
		return (
			<ul className={styles.navigationItems}>
				<li className={styles.item}><Link to="/">Browse</Link></li>
				<li className={styles.item}><Link to={{
					pathname: '/user_profile',
					search: '',
					state: { user: this.props.user, me: true }
				}}  >Profile</Link></li>
				<li className={styles.item}><Link to="/chat">Chat</Link></li>
			</ul>
		)
	}
}

export default navigationItems