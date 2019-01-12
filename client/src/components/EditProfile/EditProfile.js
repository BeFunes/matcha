import React, {Component} from 'react'
import styles from './EditProfile.module.css'
import TextInput from "../UI/TextInput/TextInput";
import {sanitise, validator} from "../../utils/string";
import FormSelector from "../UI/FormSelector";

import Chip from "@material-ui/core/es/Chip/Chip";
import TextField from "@material-ui/core/es/TextField/TextField";
import Button from '@material-ui/core/Button';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles'
import {blue} from '@material-ui/core/colors'
import {editUserMutation} from "../../graphql/mutations";
import {fetchGraphql} from "../../utils/graphql";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Divider from '@material-ui/core/Divider';
import Dropzone from '../DropZone/DropZoneWithPreview'
import classNames from 'classnames'

const blueTheme = createMuiTheme({
	palette: {
		primary: blue
	},
	typography: {
		useNextVariants: true,
	},
})

class EditProfile extends Component {

	componentDidMount() {

		this.setState({
			textFields: {
				firstName: {...this.state.textFields.firstName, value: this.props.user.firstName},
				lastName: {...this.state.textFields.lastName, value: this.props.user.lastName},
				email: {...this.state.textFields.email, value: this.props.user.email}
			},

			bio: {
				...this.state.bio, value: this.props.user.bio
			},
			tags: this.props.user.interests,
		})

	}

	componentWillMount() {
		const gender = this.props.user.gender === 'M' ? "Man" : "Woman"
		const orientation = (function (orient) {
			switch (orient) {
				case 'F':
					return 'Woman'
				case 'M':
					return 'Man'
				default:
					return 'Any'
			}
		})(this.props.user.orientation)

		this.updateOrientation(orientation)
		this.updateGender(gender)
		this.setState({somethingChanged: false})
	}

	state = {
		textFields: {
			firstName: {
				label: "First name",
				value: "",
				valid: true,
				style: {margin: '10px'},
				rules: {
					minLength: 2,
					maxLength: 30,
					isAlpha: true
				}
			},
			lastName: {
				label: "Last name",
				value: "",
				valid: true,
				style: {margin: '10px'},
				rules: {
					minLength: 2,
					maxLength: 30,
					isAlpha: true
				}
			},
			email: {
				label: 'Email',
				type: 'email',
				value: '',
				valid: true,
				placeholder: 'example@matcha.com',
				style: {margin: '10px'},
				autoComplete: 'email',
				rules: {
					minLength: 8,
					maxLength: 70,
				}
			},
		},
		orientation: {
			value: "Any"
		},
		bio: {
			label: "Bio",
			value: "",
			valid: true,
			rules: {
				minLength: 5,
				maxLength: 3000,
			}
		},
		currentTag: {
			value: "",
			valid: true,
			rules: {
				isAlpha: true,
				minLength: 3,
				maxLength: 20
			}
		},
		tags: [],
		gender: {
			value: ""
		},
		files: [],
		somethingChanged: false
	}

	inputChangeHandler = (type, {target}) => {
		const valid = validator(target.value, this.state.textFields[type].rules, target.type)
		if (this.state.textFields[type] !== target.value) {
			this.setState({
				textFields: {
					...this.state.textFields,
					[type]: {...this.state.textFields[type], value: target.value, valid: valid}
				},
				somethingChanged: true
			});
		}
	}

	bioChangeHandler = (type, {target}) => {
		let valid = validator(target.value, this.state[type].rules, target.type)
		if (type === 'currentTag' && this.state.tags.includes(sanitise(target.value).toLowerCase()))
			valid = false
		this.setState({[type]: {...this.state[type], value: target.value, valid: valid}, somethingChanged: true});
	}

	interestsFocusHandler = () => {
		this.setState({interestsSelected: true})
	}

	interestsBlurHandler = () => {
		this.setState({interestsSelected: false})
	}

	updateOrientation = (data) =>
		this.setState({orientation: {value: data}, somethingChanged: true})

	addTag = () => {
		if (this.state.currentTag.valid && this.state.currentTag.value !== '') {
			this.setState({
				tags: [...this.state.tags, sanitise(this.state.currentTag.value).toLowerCase()],
				currentTag: {...this.state.currentTag, value: ''},
				somethingChanged: true
			})
			if (this.state.tags.length === 4)
				this.interestsBlurHandler()
		}
	}

	deleteTag = tag => {
		this.setState({tags: this.state.tags.filter((x) => x !== tag), somethingChanged: true})
	}

	updateGender = (data) =>
		this.setState({gender: {value: data, somethingChanged: true}})


	saveUserData = (picUrls) => {
		console.log("SAVE USER DATA")
		let paths = picUrls
		while (paths.length < 5) { paths.push(null) }
		const data = {}
		data.requestEmail = this.props.user.email
		data.name = this.state.textFields.firstName.value
		data.lastName = this.state.textFields.lastName.value
		data.interests = this.state.tags.map(x => x.replace(/.+/g, '"$&"'))
		data.bio = JSON.stringify(this.state.bio.value)
		data.email = JSON.stringify(this.state.textFields.email.value)
		data.gender = this.state.gender.value === 'Man' ? "M" : "F"
		console.log("GENDER", data.gender)
		data.orientation = (function (orient) {
			switch (orient) {
				case 'Woman':
					return 'F'
				case 'Man':
					return 'M'
				default:
					return 'FM'
			}
		})(this.state.orientation.value)
		const query = editUserMutation(data, picUrls)
		const cb = resData => {
			if (resData.errors) {
				throw new Error(
					"Edit failed."
				)
			}
			console.log(resData)
			this.props.refreshUser(this.props.token)
			this.notify()
			setTimeout(() => {
				this.props.history.push({
					pathname: `/user_profile`,
					search: '',
					state: {user: this.props.user, me: true}
				})
			}, 800)
		}
		fetchGraphql(query, cb, this.props.token)
	}

	onSaveClick = () => {
		console.log("SAVE USER DATA")
		this.uploadPic(this.saveUserData)
	}

	notify = () => toast.success("Profile modified !", {
		position: toast.POSITION.BOTTOM_RIGHT,
		autoClose: 2000
	});

	pictureDisplay = () => {
		const dropZones = []
		const { user} = this.props
		const picArray = [user.profilePic, user.picture2, user.picture3, user.picture4, user.picture5]
		const key = ['profilePic', 'picture2', 'picture3', 'picture4', 'picture5']
		dropZones.push((<Dropzone {...this.props} key={key[0]} profilePic={picArray[0]} save={this.savePictureInState}
		                          delete={this.deletePictureFromState} exist={this.checkIfPictureAlreadyDropped}
		                          picType={key[0]}/>))
		let i;
		for (i = 1; i < 5; i++) {
			dropZones.push((<Dropzone {...this.props} key={key[i]} profilePic={picArray[i]} save={this.savePictureInState}
			                          delete={this.deletePictureFromState} exist={this.checkIfPictureAlreadyDropped}
			                          picType={key[i]}/>))
		}
		return dropZones
	}

	savePictureInState = (info) => {
		this.setState({files: this.state.files.concat(info), somethingChanged: true},
			() => {
				let unique = [...new Set(this.state.files)]
				this.setState({files: unique})
			}
		)
	}

	deletePictureFromState = (info) => {
		const indexPic = this.state.files.findIndex(item => info.preview === item.preview)
		this.setState({
			...this.state,
			files: this.state.files.filter((item, index) => index !== indexPic),
			somethingChanged: true
		})
	}

	checkIfPictureAlreadyDropped = (info) => {
		const indexPic = this.state.files.findIndex(item => info.name === item.name)
		if (indexPic !== -1) {
			return false
		}
		return true
	}

	uploadPic = (cb) => {
		const { user} = this.props
		const oldUrls = [user.profilePic, user.picture2, user.picture3, user.picture4, user.picture5]

		const formData = new FormData()
		this.state.files.forEach((item, i) => {
			formData.append('image', item)
			console.log("OLD>>", oldUrls[i])
			if (!!oldUrls[i]) {
				console.log("OLD PATH", oldUrls[i])
				formData.append('oldPath', oldUrls[i]);
			}
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
				console.log("FILE RES DATA", fileResData)
				cb(fileResData.filePath.map(x => x.path))
			})
			.catch(err => {
				console.log(err)
			})
	}

	render() {
		const elementsArray = [];
		for (let key in this.state.textFields) {
			elementsArray.push({
				...this.state.textFields[key],
				id: key
			});
		}
		const allValid = elementsArray.every((x) => x.valid && x.value !== '') && this.state.bio.valid && this.state.tags.length
		const interestBorderStyle = this.state.interestsSelected ? {border: "2px solid #3f51b5"} : {border: "1px solid #b7b7b7"}
		const enableSave = allValid && this.state.bio.valid && !!this.state.tags.length

		return (
			<div className={styles.component}>

				<div className={styles.page}>
					<div className={styles.title}>Your profile</div>
					<div className={styles.headerName}>
						<div className={styles.name}>
							{elementsArray.map(element => (
								<div key={element.id}>
									<TextInput
										label={element.label}
										value={element.value}
										style={element.style}
										type={element.type}
										onChange={this.inputChangeHandler.bind(this, element.id)}
										error={!element.valid}
									/></div>))}
						</div>
						<div>
							<FormSelector options={['Woman', 'Man']} formName={"Gender"} onChange={this.updateGender}
							              value={this.state.gender.value}/></div>
						<div>
							<FormSelector options={['Any', 'Woman', 'Man']} formName={"Looking for"} onChange={this.updateOrientation}
							              value={this.state.orientation.value}/>
						</div>
					</div>

					<TextInput
						ref={(input) => {
							this.bioInput = input;
						}}
						label={this.state.bio.label}
						value={this.state.bio.value}
						error={!this.state.bio.valid}
						multiline={true}
						rows={12}
						onChange={this.bioChangeHandler.bind(this, "bio")}
					/>

					<div className={styles.interests} style={interestBorderStyle}>
						<div className={styles.interestsLabel}>Interests</div>
						<div className={styles.chips}>
							{this.state.tags.map((tag) =>
								<Chip className={styles.chip} key={tag} label={tag} color="primary"
								      onDelete={this.deleteTag.bind(this, tag)}/>
							)}
							{this.state.tags.length < 5 && <TextField
								onChange={this.bioChangeHandler.bind(this, "currentTag")}
								margin="normal"
								style={{height: '18px', width: "120px"}}
								error={!this.state.currentTag.valid}
								value={this.state.currentTag.value}
								onFocus={this.interestsFocusHandler}
								onBlur={this.interestsBlurHandler}
								onKeyDown={e => {
									if (e.key === 'Enter' || e.key === 'Tab') {
										if (this.state.currentTag.value) {
											e.preventDefault()
										}
										this.addTag()
									}
								}}
							/>}
						</div>
					</div>

					<div className={styles.pictureContainer}>
						{this.pictureDisplay()}
					</div>
					<Button color="primary" variant={"contained"} onClick={this.onSaveClick}
					        style={{marginTop: "10px"}} disabled={!enableSave}>
						Save
					</Button>
				</div>
			</div>

		)
	}
}


export default EditProfile