/**
 * index.js
 *
 * Main entry point for our app
 *
 * This file loads the ExpressJS application from app.js and launches it by calling listen()
 */

const app = require('./app')
const config = require('./config')

// Launch the app!
app.listen(config.port, () => {
    console.log(`Example app listening at http://localhost:${config.port}`)
})
