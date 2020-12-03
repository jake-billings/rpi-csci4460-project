const express = require('express')
const app = express()
const config = require('./config')
const bodyParser = require('body-parser')


/**
 * rank_of()
 *
 * pure function
 *
 * multiplies each feature value by its weight then take the sum to get an element's ranking
 *
 * @param features      a features object from the request specification
 * @returns {number}    a number (floating point) representing the ranking assigned to that set of features
 */
const rank_of = features => Object
    // For each key in the feature weights from the config file,
    .keys(config.featureWeights)
    // Find the weight we get by multiplying the value in the request by the weight in the config file
    .map(key => {
        return features[key] * config.featureWeights[key]
    })
    // Sum all of the weighted values to get the final rank
    .reduce((sum, element) => {
        return sum + element;
    })

// Use the body-parser library to parse incoming JSON requests to the req.body field
app.use(bodyParser.json())

/**
 * POST /rank
 *
 * route
 *
 * This endpoint accepts a search query and a set (represented as an array) of candidate results. The
 * endpoint will apply a relevance-based ranking algorithm based on metadata in these results and the
 * query string. We will return the ranked results without the metadata. This endpoint has no side
 * effects on the ranking subcomponent, and does not make calls to any other subcomponents. We expect
 * the query component to call this endpoint.
 *
 * See Team Deliverable 2 for further documentation
 */
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
                return rank_of(b.features) - rank_of(a.features)
            })
            .map((resultPair) => {
                return resultPair.result
            })

    res.send(sortedResults)
})

/**
 * *
 *
 * route
 *
 * returns a 404 for all unrecognized requests
 */
app.use('*', (req, res) => {
    res.status(404).send({
        message: 'Sorry, that route does not resolve to an endpoint.',
        status: 404
    })
})

module.exports = app
