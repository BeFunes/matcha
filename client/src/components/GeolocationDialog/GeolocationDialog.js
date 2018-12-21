import React, {Component} from 'react'
import Dialog from "@material-ui/core/es/Dialog/Dialog";
import Button from "@material-ui/core/es/Button/Button";

class GeolocationDialog extends Component {

	render() {
		const {onClose, open, onYes, location} = this.props
		console.log(location)
		return (
			<Dialog onClose={onClose} open={open}>
				Update your location to {location.address}?
				<Button onClick={onClose}>NO</Button>
				<Button onClick={onYes}>YES</Button>
			</Dialog>
		);
	}
}

export default GeolocationDialog
