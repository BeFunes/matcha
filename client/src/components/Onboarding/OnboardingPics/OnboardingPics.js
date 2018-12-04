import React from 'react'
import styles from './OnboardingPics.module.css'
import Fab from "@material-ui/core/es/Fab/Fab";
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import LinearProgress from "@material-ui/core/es/LinearProgress/LinearProgress";

class OnboardingPics extends React.Component {
	state = {
	}

	render() {
		const {nextPage, previousPage, completedProgress} = this.props

		// const allValid = elementsArray.every((x) => x.valid && x.value !== '')


		return (
			<div className={styles.component}>
				<div className={styles.upperPart}>



				</div>
				<div className={styles.navigation}>
					<div className={styles.buttons}>
						<Fab onClick={previousPage} color="secondary" variant="extended" >
							<NavigateBeforeIcon/>
						</Fab>
						<Fab onClick={nextPage} color="secondary" variant="extended" >
							<NavigateNextIcon/>
						</Fab>
					</div>
					<LinearProgress color="primary" className={styles.progress} variant="determinate" value={completedProgress}/>
				</div>
			</ div>
		)
	}
}

export default OnboardingPics