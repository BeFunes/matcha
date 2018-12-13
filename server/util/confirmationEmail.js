const emailBody = (host, token) => {
	return (
		`<a href="${host}confirmation/${token}" 
					target="_blank" 
					rel="noopener noreferrer" 
					data-auth="NotApplicable" 
					style="font-size:20px; font-family:Helvetica,Arial,sans-serif; color:#ffffff; text-decoration:none; -webkit-border-radius:7px; -moz-border-radius:7px; border-radius:7px; padding:12px 18px; border:1px solid #85b5ff; display:inline-block"
					> CONFIRMATION ▸
					</a>`

	)
}

module.export = emailBody