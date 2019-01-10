import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import styles from './DropZoneWithPreview.module.css'
import PictureIcon from '@material-ui/icons/AddPhotoAlternate'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete';

const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
};

const thumb = {
    display: 'inline-flex',
    // flexWrap: 'wrap',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 149,
    height: 149,
    padding: 4,
    justifyContent: 'center',
    boxSizing: 'border-box'
};

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

const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
}

const img = {
    display: 'block',
    width: 'auto',
    // height: '100%',
    maxWidth: '150px',
    maxHeight: '150px',

};

class DropzoneWithPreview extends React.Component {
    constructor() {
        super()
        this.state = {
            files: [],
            upload: [],
        };
    }

    onDrop(files) {
        this.setState({
            files: files.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })),
            upload: this.state.upload.concat(files[0])
        }, () => {this.props.save(this.state.upload)});

    }

    componentWillMount() {
        if (this.props.profilePic) {
            this.setState({
                files: this.state.files.concat({ preview: this.props.profilePic, name: this.props.profilePic })
            });
        }

    }

    componentWillUnmount() {
        // Make sure to revoke the data uris to avoid memory leaks
        this.state.files.forEach(file => URL.revokeObjectURL(file.preview))
    }

    render() {
        const { files } = this.state;
        console.log("State inside dropzone ", this.state)

        const thumbs = files.map(file => (
            <div key={file.name} style={{ margin: 'auto', maxWidth: '150px', maxHeight: '150px' }}>
                <img
                    src={file.preview}
                    style={img}
                />

            </div>
        ));
        const imageIcon = (<div style={{ margin: 'auto', maxWidth: '150px', maxHeight: '150px' }}>
            <PictureIcon> </PictureIcon>
        </div>)

        return (
            <div className={styles.component}>
                {this.state.files.length > 0 ? <IconButton aria-label="Delete" style={button} onClick={() => { this.setState({files: [], upload: []})}}>
                    <DeleteIcon className={styles.toto} />
                </IconButton> : null}
                <Dropzone
                    accept="image/*"
                    onDrop={this.onDrop.bind(this)}
                >
                    {({ getRootProps, getInputProps }) => (
                        <div {...getRootProps()}>
                            <input {...getInputProps()} />

                            <Container>
                                {thumbs}
                                {this.state.files.length <= 0 ? imageIcon : null}
                            </Container>
                        </div>
                    )}
                </Dropzone>
                <aside style={thumbsContainer}>

                </aside>
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
  border-color: ${props => getColor(props)};
  border-style: ${props => props.isDragReject || props.isDragActive ? 'solid' : 'dashed'};
  background-color: ${props => props.isDragReject || props.isDragActive ? '#eee' : ''};
`;

export default DropzoneWithPreview