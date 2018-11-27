import React from 'react'
import LinearProgress from "@material-ui/core/es/LinearProgress/LinearProgress";
import styles from './Onboarding.module.css'
import OnboardingProfile from "./OnboardingProfile/OnboardingProfile";

class Onboarding extends React.Component {
	state = {
		completed: 40,
		currentPage: 0
	}

	nextPage = () => {
		this.setState({ currentPage: this.state.currentPage + 1 })
	}

	previousPage = () => {
		this.setState({ currentPage: this.state.currentPage - 1 })
	}

	render () {
		console.log(this.state)
		return (
			<div className={styles.component}>
				<OnboardingProfile
					nextPage={this.nextPage}
					previousPage={this.previousPage}
					completedProgress={this.state.completed}
				/>
				{/*<LinearProgress className={styles.progress} variant="determinate" value={this.state.completed} />*/}
			</div>
		)
	}
}

export default Onboarding