const {clearImage, fileFilter, fileStorage} = require("./util/imageHelpers")

const path = require('path')
const fs = require('fs')

const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const multer = require('multer')

const auth = require('./middleware/auth')

const graphqlSchema = require('./graphql/schema')
const graphqlResolver = require('./graphql/resolvers/')

const app = express()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())// application/json
app.use(
	multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
)
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader(
		'Access-Control-Allow-Methods',
		'OPTIONS, GET, POST, PUT, PATCH, DELETE'
	)
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
	if (req.method === 'OPTIONS') {
		return res.sendStatus(200)
	}
	next()
})

app.use(auth)

app.put('/post-image', (req, res, next) => {
	if (!req.isAuth) {
		throw new Error('Not authenticated!');
	}
	if (!req.file) {
		return res.status(200).json({ message: 'No file provided!' });
	}
	if (req.body.oldPath) {
		clearImage(req.body.oldPath);
	}
	return res
		.status(201)
		.json({ message: 'File stored.', filePath: req.file.path });
});


app.use(
    '/graphql',
    graphqlHttp({
        schema: graphqlSchema,
        rootValue: graphqlResolver,
        graphiql: true,
        // formatError(err) {
        //     if (!err.originalError) {
        //         return err
        //     }
        //     const data = err.originalError.data
        //     const message = err.message || 'An error occurred.'
        //     const code = err.originalError.code || 500
        //     return { message: message, status: code, data: data }
        // }
    })
)




app.use((error, req, res, next) => {
    console.log(error)
    const status = error.statusCode || 500
    const message = error.message
    const data = error.data
    res.status(status).json({ message: message, data: data })
})


module.exports = app
