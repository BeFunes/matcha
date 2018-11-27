const validatorAux = (value, type) => {
	// eslint-disable-next-line no-control-regex
	const unicodePattern = /[^\x00-\x7F]/
	switch (type) {
		case 'email':
			const emailPattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
			return !unicodePattern.test(value) && emailPattern.test(value)
		case 'password':
			const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/   /// must contain one lowercase, one uppercase, one digit. To add a symbol: (?=.*[!@#\$%\^&\*])
			return !unicodePattern.test(value) && passwordPattern.test(value)
		default:
			return true
	}
}

export const validator = (value, rules, type) => {
	let isValid = true
	if (rules.minLength) {
		isValid = value.length >= rules.minLength && isValid
	}
	if (rules.maxLength) {
		isValid = value.length <= rules.maxLength && isValid
	}
	return validatorAux(value, type) && isValid
}

export const sanitise = (value) => value && value.trim();

export const passwordCriteria = 'Password must have at least 8 characters, including at least one capital letter, one lower case letter and one number'