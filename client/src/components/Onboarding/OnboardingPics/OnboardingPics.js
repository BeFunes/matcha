import React from 'react'
import styles from './OnboardingPics.module.css'
import Fab from "@material-ui/core/es/Fab/Fab";
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import LinearProgress from "@material-ui/core/es/LinearProgress/LinearProgress";
import Button from "@material-ui/core/es/Button/Button";
import ImageUploader from 'react-images-upload';

class OnboardingPics extends React.Component {
	state = {
	}

	onDrop = (picture) => {
		this.setState({
			profilePic: picture[0]
		})
	}

	render() {
		const {nextPage, previousPage, completedProgress} = this.props

		// const allValid = elementsArray.every((x) => x.valid && x.value !== '')
		const save = () => this.props.save({
			profilePic: this.state.profilePic
		})

		return (
			<div className={styles.component}>
				<div className={styles.upperPart}>
					<ImageUploader
						buttonText='Choose your profile pic'
						withPreview={true}
						withLabel={false}
						onChange={this.onDrop}
						imgExtension={['.jpg', '.gif', '.jpeg', '.png']}
						singleImage={true}
					/>

				</div>
				<div className={styles.navigation}>
					<div className={styles.buttons}>
						<Fab onClick={previousPage} color="secondary" variant="extended" >
							<NavigateBeforeIcon/>
						</Fab>
						<Fab onClick={save} color="secondary" variant="extended" >
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