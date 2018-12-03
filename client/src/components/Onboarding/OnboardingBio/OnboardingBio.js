import React from 'react'
import styles from './OnboardingBio.module.css'
import Fab from "@material-ui/core/es/Fab/Fab";
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import LinearProgress from "@material-ui/core/es/LinearProgress/LinearProgress";
import TextInput from "../../UI/TextInput/TextInput";
import {validator} from "../../../utils/string";
import Chip from "@material-ui/core/es/Chip/Chip";

class OnboardingBio extends React.Component {
	state = {
		job: {
			label: "Occupation",
			value: "",
			valid: true,
			rules: {
				minLength: 5,
				maxLength: 50,
				isAlpha: true
			}
		},
		bio: {
			label: "Bio",
			value: "",
			valid: true,
			rules: {
				minLength: 5,
				maxLength: 3000,
				isAlpha: true
			}
		}

	}

	handleDelete = event => {
		console.log(event)
	}
	inputChangeHandler = (type, {target}) => {
		const valid = validator(target.value, this.state[type].rules, target.type)
		if (this.state[type] !== target.value) {
			this.setState({[type]: {...this.state[type], value: target.value, valid: valid}});
		}
	}

	render() {
		const {previousPage, completedProgress} = this.props
		const elementsArray = [];
		for (let key in this.state) {
			elementsArray.push({
				...this.state[key],
				id: key
			});
		}
		const allValid = elementsArray.every((x) => x.valid && x.value !== '')


		return (
			<div className={styles.component}>
				<div className={styles.upperPart}>
					<TextInput
						label={this.state.job.label}
						value={this.state.job.value}
						error={!this.state.job.valid}
						onChange={this.inputChangeHandler.bind(this, "job")}
					/>
					<div>
						Interests
						<div>
						<Chip label="something" color="primary" onDelete={this.handleDelete}/>
						</div>
					</div>
					<TextInput
						label={this.state.bio.label}
						value={this.state.bio.value}
						error={!this.state.bio.valid}
						multiline={true}
						rows={10}
						onChange={this.inputChangeHandler.bind(this, "bio")}
					/>
				</div>
				<div className={styles.navigation}>
					<div className={styles.buttons}>
						<Fab onClick={previousPage} color="secondary" variant="extended" >
							<NavigateBeforeIcon/>
						</Fab>
					</div>
					<LinearProgress color="primary" className={styles.progress} variant="determinate" value={completedProgress}/>
				</div>
			</ div>
		)
	}
}

export default OnboardingBio