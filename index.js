const express = require('express')
const app = express()
const port = 3000

app.post('/rank', (req, res) => {
    res.send('Hello World!')
})

app.use('*', (req, res) => {
    res.status(404).send({
        message: 'Sorry, that route does not resolve to an endpoint.',
        status: 404
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
