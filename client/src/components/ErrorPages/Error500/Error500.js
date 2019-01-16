import React from 'react'
import styles from './../Errors.module.css'
import SadFace from '@material-ui/icons/SentimentDissatisfied'


const Error500 = () => {

	return (
		<div className={styles.component}>
			<SadFace style={{fontSize: 120}}/>
			<p> Ooops </p>
			<p> It looks like something went wrong </p>
		</div>
	)

}

export default Error500