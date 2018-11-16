
const express = require('express')
const parser = require('body-parser')
const app = express()

const adminRoutes = require('./routes/admin')
const userRoutes = require('./routes/user')

const db = require('./util/database')

db.execute('SELECT * FROM user')
    .then(result => {
        console.log(result)
    })
    .catch( err => {
        console.log(err)
    })

app.use(parser.urlencoded({extended: false}))

app.use('/admin', adminRoutes)
app.use('/', userRoutes)

app.listen(3000)


