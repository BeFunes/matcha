import React from 'react'
import styles from './OnboardingProfile.module.css'
import Button from "@material-ui/core/es/Button/Button";
import OnboardingControllers from "../OnboardingControllers";
import TextInput from "../../UI/TextInput/TextInput";
import Fab from "@material-ui/core/es/Fab/Fab";
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import LinearProgress from "@material-ui/core/es/LinearProgress/LinearProgress";
import FormSelector from "../../UI/FormSelector";
import TextField from "@material-ui/core/es/TextField/TextField";


class OnboardingProfile extends React.Component {
	state = {
		firstName: {
			label: "First name",
			value: "",
			valid: true,
			style: {margin: '10px'}
		},
		lastName: {
			label: "Last name",
			value: "",
			valid: true,			style: {margin: '10px'}
		},
		birthDate: {
			label: "Date of birth",
			valid: true,
			defaultValue: "2000-05-24",
			type: 'date'
		}
	}

	render() {
		const {nextPage, previousPage, completedProgress} = this.props
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
				<div className={styles.navigation}>
					<LinearProgress color="primary" className={styles.progress} variant="determinate" value={completedProgress}/>
					<div className={styles.buttons}>
						<Fab onClick={nextPage} color="secondary" variant="extended" >
							<NavigateNextIcon/>
						</Fab>
					</div>
				</div>
				{/*<header className={styles.header}>*/}
					{/*Tell us something about yourself*/}
				{/*</header>*/}
				<div className={styles.form}>
					<form noValidate autoComplete="on" className={styles.basicInfo}>
						{elementsArray.map(element => (
							<div>
							<TextInput
								key={element.id}
								label={element.label}
								value={element.value}
								defaultValue={element.defaultValue}
								style={element.style}
								type={element.type}
								// onChange={}
								// onKeyPress={e => { if (e.key === 'Enter' && allValid) { login() }}}
								error={!element.valid}
							/></div>))}
					</form>
					<div className={styles.gender}>
						<FormSelector options={['Woman', 'Man']} formName={"Gender"}/>
						<FormSelector options={['Any', 'Woman', 'Man']} formName={"Looking for"}/>
					</div>
				</div>
				{/*<div className={styles.navigation}>*/}
					{/*<LinearProgress color="primary" className={styles.progress} variant="determinate" value={completedProgress}/>*/}
					{/*<div className={styles.buttons}>*/}
						{/*<Fab onClick={nextPage} color="secondary" variant="extended" >*/}
							{/*<NavigateNextIcon/>*/}
						{/*</Fab>*/}
					{/*</div>*/}
				{/*</div>*/}
			</ div>
		)
	}
}

export default OnboardingProfile