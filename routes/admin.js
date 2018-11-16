const express = require('express')

const router = express.Router()

router.get('/', (req, res, next) => {
    return res.send("<h1>This is admin page</h1>")
})



module.exports = router