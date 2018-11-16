
const express = require('express')
const parser = require('body-parser')
const app = express()

const adminRoutes = require('./routes/admin')

app.use(parser.urlencoded({extended: false}))

app.use('/admin', adminRoutes)

app.listen(3000)


