import moment from "moment";

export const getAge = (dob) => {
	const epoch = dob.substring(0, dob.length-3)
	return moment().diff(moment.unix(epoch), 'years')
}


export const stillOnline = (date) => {
	if (!date) { return false}
	const lastOnline = moment(date, "DD/MM/YYYY, HH:mm:ss")
	return (!(lastOnline.add(4, 'minutes') < moment()))
}

export const formatLastOnline = (date) => {
	if (!date) { return date }
	const d = moment(date, "DD/MM/YYYY, HH:mm:ss")
	const hour = d.format("h:mm a")
	const day = d.format("D MMM")
	if (d.isSame(moment(), 'day')) {
		return (`Today, ${hour}`)
	}
	else if (d.isSame(moment().subtract(1, 'days'), 'day')) {
		return `Yesterday, ${hour}`
	}
	else if (d.isSame(moment(), 'year')) {
		return (`${day}, ${hour}`)
	}
	else {
		return `${day} ${d.format("YYYY")}, ${hour}`
	}
}

export const currentDate = () => {
	return moment().format("DD/MM/YYYY, HH:mm:ss")
}