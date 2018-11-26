import React from 'react'
import logoJpg from '../../assets/images/logo.jpg'
import styles from './Logo.module.css'

const logo = (props) => (
	<div className={styles.logo}>
		<img src={logoJpg} alt="MatchaLove" />
	</div>
)

export default logo