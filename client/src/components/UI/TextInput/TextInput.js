import React from 'react'
import TextField from "@material-ui/core/es/TextField/TextField";

class TextInput extends React.Component {
	render () {
		const { label, type, value, onChange, error, autoComplete, placeholder, onKeyPress} = this.props
		return (
			<TextField
				// id="outlined-name"
				label={label}
				autoComplete={autoComplete}
				type={type}
				value={value}
				placeholder={placeholder}
				onChange={onChange}
				onKeyPress={onKeyPress}
				margin="normal"
				variant="outlined"
				style={{
					margin: '10px 15px'
				}}
				error={error}
			/>
		)
	}

}

export default TextInput