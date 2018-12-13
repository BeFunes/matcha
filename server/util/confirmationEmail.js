const CONST = require('../../constants')
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport')
const jwt = require('jsonwebtoken')

const emailBody = (token) => {
	return (
		`<a href="${CONST.HOST}confirmation/${token}" 
					target="_blank" 
					rel="noopener noreferrer" 
					data-auth="NotApplicable" 
					style="font-size:20px; font-family:Helvetica,Arial,sans-serif; color:#ffffff; text-decoration:none; text-decoration:none; -webkit-border-radius:7px; -moz-border-radius:7px; border-radius:7px; padding:12px 18px; border:1px solid #85b5ff; display:inline-block"
					> CONFIRMATION ▸
					</a>`
	)
}

const transporter = nodemailer.createTransport(sendGridTransport({
	auth: {
		api_key: CONST.SEND_GRID_API_KEY
	}
}))

module.exports = {
	sendConfirmationEmail: async function (email) {
		const confirmationToken = jwt.sign(
			{email: email },
			CONST.EMAIL_CONFIRMATION_SECRET,
			{expiresIn: '12h'}
		)
		await transporter.sendMail({
			to: email,
			from: 'raghirelli@gmail.com',
			subject: 'Confirmation',
			html: emailBody(confirmationToken)
		}, (err) => {
			if (err) {
				console.log(err)
				throw new Error("can't send confirmation email")
			}
		})
	}
}