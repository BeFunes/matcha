import React from 'react'
import styles from './../Errors.module.css'
import Hand from '@material-ui/icons/PanTool'
import Button from "@material-ui/core/es/Button/Button";


const Error401 = (props) => {

	const onClick = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('expiryDate');
		localStorage.removeItem('userId');
		props.history.push({pathname: `/`})
	}

	return (
		<div className={styles.component}>
			<Hand style={{fontSize: 120}}/>
			<p> Sorry! </p>
			<p> It looks like you are not authorised for this action </p>
			<Button
				variant="contained"
				color="secondary"
				onClick={onClick}
				size="large"
				style={{fontSize: '0.7em', fontWeight: 600, margin: 40}}
			>
				Go to login page
			</Button>
		</div>

	)

}

export default Error401