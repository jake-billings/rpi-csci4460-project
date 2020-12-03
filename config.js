/**
 * config
 *
 * JSON Object
 *
 * This is the configuration file for the Team A ranking component.
 *  Use it to control the behavior of the component.
 */
const config = {
    /**
     * featureWeights
     *
     * JSON Object
     *
     * The feature weights object controls the weight each feature
     *  that may be received on a ranking request is given in the
     *  ranking comparator.
     *
     * Higher weight -> higher relevance for this feature.
     */
    featureWeights: {
        pageRank: 5,
        isRPIAffiliated: 50
    },

    /**
     * port
     *
     * this is the port the ExpressJS server will listen on when the server launches
     */
    port: 3000
}

module.exports = config
