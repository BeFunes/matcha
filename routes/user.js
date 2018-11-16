const express = require('express')

const router = express.Router()

router.get('/', (req, res, next) => {
    return res.send("<h1>This is user page</h1><form action='/result' method='POST'>" +
        "<input type='text' title='user name' name='userName'>" +
        "<input type='text' title='password' name='password'>" +
        "<button type='submit' >Sign in</button> </form>")
})


router.post('/result', (req, res, next) => {
    return res.send("<h1>result</h1>")
})



module.exports = router