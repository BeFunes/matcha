import React from 'react'
import styles from './OnboardingPics.module.css'
import Fab from "@material-ui/core/es/Fab/Fab";
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import LinearProgress from "@material-ui/core/es/LinearProgress/LinearProgress";
import ImageUploader from 'react-images-upload';

class OnboardingPics extends React.Component {
	constructor() {
		super()
		this.flag = false
	}
	state = {
		pictures: [],
	}

	///////// PROBLEM. This is called twice, therefore uploadPic is called twice.
	/// This will be fixed once we change the picture uploader
	onDrop = (pictures) => {
		if (this.flag) {
			console.log("yeah", pictures)
			this.setState({
				pictures: pictures,
			}, () => { console.log("statePicture ----> ", this.state.pictures) });
		}

		this.flag = !this.flag
	}
	//////////////////

	uploadPic = (data, picType) => {
		const formData = new FormData()
		this.state.pictures.forEach((item) => {
			formData.append('image', item)
		})
		fetch('http://localhost:3001/post-image', {
			method: 'PUT',
			headers: {
				Authorization: 'Bearer ' + this.props.token,
			},
			body: formData
		})
			.then(res => res.json())
			.then(fileResData => {
				console.log(fileResData)
				this.save(fileResData.filePath)
			})
			.catch(err => {
				console.log(err)
			})
	}

	setPath = (fileResData) => {

	}
	componentDidMount() {
		const { profilePic, picture2, picture3, picture4, picture5 } = this.props
		console.log("Propssss", this.props)
		this.setState({
			profilePicPath: profilePic,
			picture2Path: picture2,
			picture3Path: picture3,
			picture4Path: picture4,
			picture5Path: picture5
		})
	}

	save = (fileResData) => {
		this.props.save({
			profilePic: fileResData[0].path,
			picture2: fileResData[1] ? fileResData[1].path : null,
			picture3: fileResData[2] ? fileResData[2].path : null,
			picture4: fileResData[3] ? fileResData[3].path : null,
			picture5: fileResData[4] ? fileResData[4].path : null

		})
	}

	render() {
		const { previousPage, completedProgress } = this.props

		// const allValid = elementsArray.every((x) => x.valid && x.value !== '')

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
							<NavigateBeforeIcon />
						</Fab>
						<Fab onClick={() => { if (this.state.pictures.length > 0) { this.uploadPic() } }}
							color="secondary" variant="extended" >
							<NavigateNextIcon />
						</Fab>
					</div>
					<LinearProgress color="primary" className={styles.progress} variant="determinate" value={completedProgress} />
				</div>
			</ div>
		)
	}
}

export default OnboardingPics