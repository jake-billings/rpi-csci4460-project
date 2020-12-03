const express = require('express')
const app = express()
const config = require('./config')
const bodyParser = require('body-parser')

const weight_of = result => Object
    .keys(config.featureWeights)
    .map(key => {
        return result[key] * config.featureWeights[key]
    })
    .reduce((sum, element) => {
        return sum + element;
    })

app.use(bodyParser.json())

app.post('/rank', (req, res) => {
    if (typeof req.body !== 'object') {
        return res.status(400).send({
            message: 'Request must be a JSON object.',
            status: 400
        })
    }
    if (typeof req.body.query !== 'string') {
        return res.status(422).send({
            message: 'Request body must contain a string field \'query\'',
            status: 422
        })
    }
    if (!Array.isArray(req.body.results)) {
        return res.status(422).send({
            message: 'Request body must contain an array field \'results\'',
            status: 422
        })
    }

    let resultErrors = [];

    req.body.results.forEach(resultPair => {
        if (typeof resultPair !== 'object') {
            return resultErrors.push({
                message: 'Result must be an object.'
            })
        }
        if (typeof resultPair.result !== 'object') {
            return resultErrors.push({
                message: 'Result must be an object.'
            })
        }
        if (typeof resultPair.features !== 'object') {
            return resultErrors.push({
                message: 'Result must have field \'features\' with type object.'
            })
        }
    })

    if (resultErrors.length > 0) {
        return res.status(422).send({
            message: 'An error or errors occured validating results',
            status: 422,
            errors: resultErrors
        })
    }

    const sortedResults =
        req.body.results
            .sort((a, b) => {
                return weight_of(b.features) - weight_of(a.features)
            })
            .map((resultPair) => {
                return resultPair.result
            })

    res.send(sortedResults)
})

app.use('*', (req, res) => {
    res.status(404).send({
        message: 'Sorry, that route does not resolve to an endpoint.',
        status: 404
    })
})

module.exports = app
