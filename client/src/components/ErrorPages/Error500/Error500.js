import React from 'react'
import styles from './../Errors.module.css'
import SadFace from '@material-ui/icons/SentimentDissatisfied'
import Button from "@material-ui/core/es/Button/Button";


const Error500 = (props) => {
	const onClick = () => {
		props.history.push({pathname: `/`})
	}

	return (
		<div className={styles.component}>
			<SadFace style={{fontSize: 120}}/>
			<p> Ooops... </p>
			<p> It looks like something went wrong </p>
			<Button
			variant="contained"
			color="secondary"
			onClick={onClick}
			size="large"
			style={{fontSize: '0.7em', fontWeight: 600, margin: 40}}
		>
			Go back to the home page
		</Button>

		</div>
	)

}

export default Error500