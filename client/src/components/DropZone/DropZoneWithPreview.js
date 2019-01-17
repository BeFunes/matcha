import React, {Component} from 'react'
import Dropzone from 'react-dropzone'
import styles from './DropZoneWithPreview.module.css'
import PictureIcon from '@material-ui/icons/AddPhotoAlternate'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete';

const button = {
	color: 'rgb(251, 250, 250)',
	padding: 12,
	overflow: 'visible',
	fontSize: '1.5rem',
	textAlign: "center",
	transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
	borderRadius: '50%',
	position: 'absolute',
	right: '-20px',
	top: '-22px',
	backgroundColor: 'black',
}


class DropzoneWithPreview extends React.Component {
	constructor() {
		super()
		this.state = {
			files: [],
			upload: [],
		};
	}

	onDrop(files) {
		if (this.props.exist(files[0])) {
			files[0].picType = this.props.picType
			this.setState({
				files: files.map(file => Object.assign(file, {
					preview: URL.createObjectURL(file)
				})),
			}, () => {
				this.props.save(this.state.files)
			});
		}
	}

	onDelete = () => {
		this.props.delete(this.state.files[0])
		this.setState({files: [], upload: []})
	}

	componentWillMount() {
		if (this.props.profilePic && typeof this.props.profilePic !== 'undefined') {
			this.setState({
				files: this.state.files.concat({
					preview: this.props.profilePic,
					name: this.props.profilePic,
					picType: this.props.picType
				})
			});
		}
	}


	componentWillUnmount() {
		// Make sure to revoke the data uris to avoid memory leaks
		this.state.files.forEach(file => URL.revokeObjectURL(file.preview))
	}

	render() {
		const {files} = this.state;
		const { picType } = this.props
		const thumbs = files.map(file => (
			<div key={file.name} style={{margin: 'auto', maxWidth: '150px', maxHeight: '150px'}}>
				<img
					src={file.preview}
					className={styles.img}
				/>
			</div>
		));
		const imageIcon = (<div style={{margin: 'auto', maxWidth: '150px', maxHeight: '150px'}}>
			<PictureIcon> </PictureIcon>
		</div>)

		const compStyle = { border: picType === 'profilePic' ? '6px solid gold' : 'none'}
		return (
			<div className={styles.component} style={compStyle}>
				{!!this.state.files.length > 0 &&
					<IconButton aria-label="Delete" style={button} onClick={this.onDelete}>
						<DeleteIcon/>
					</IconButton>}
				<Dropzone
					multiple={false}
					accept="image/*"
					onDrop={this.onDrop.bind(this)}
				>
					{({getRootProps, getInputProps}) => (
						<div {...getRootProps()}>
							<input {...getInputProps()} />
							<Container>
								{thumbs}
								{!!this.state.files.length <= 0 && imageIcon}
							</Container>
						</div>
					)}
				</Dropzone>
			</div>
		);
	}
}

const styled = require('styled-components').default;

const getColor = (props) => {
	if (props.isDragReject) {
		return '#c66';
	}
	if (props.isDragActive) {
		return '#6c6';
	}
	return '#666';
};


const Container = styled.div`
display: flex;
  width: 150px;
  height: 150px;
  border-width: 2px;
  border-radius: 5px;
  border-color: ${props => {console.log(props); return getColor(props)}};
  border-style: ${props => props.isDragReject || props.isDragActive ? 'solid' : 'dashed'};
  background-color: ${props => props.isDragReject || props.isDragActive ? '#eee' : ''};
`;

export default DropzoneWithPreview