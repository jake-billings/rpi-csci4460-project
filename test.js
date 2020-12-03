const request = require('supertest')
const app = require('./app.js')
const expect = require('chai').expect

describe('Team A Ranking Component', function () {
    describe('POST /nonexistant endpoint', async function () {
        const response = await request(app)
            .post('/nonexistant')
            .send({
                not: 'the',
                right: 'fields'
            })

        expect(response.status).to.equal(404)
    })

    describe('POST /rank endpoint', function () {
        it('should return 422 for invalid request object', async function () {
            const response = await request(app)
                .post('/rank')
                .send({
                    not: 'the',
                    right: 'fields'
                })

            expect(response.status).to.equal(422)
        })

        it('should rank elements within a request; should rank RPI-affiliated results higher', async function () {
            const response = await request(app)
                .post('/rank')
                .send({
                    query: 'class schedule',
                    results: [{
                        result: {
                            title: 'YACS',
                            url: 'https://yacs.rpi.cs.edu'
                        },
                        features: {
                            pageRank: 7,
                            isRPIAffiliated: false
                        }
                    }, {
                        result: {
                            title: 'RPI Course Catalog',
                            url: 'https://yacs.rpi.cs.edu'
                        },
                        features: {
                            pageRank: 2,
                            isRPIAffiliated: 1
                        }
                    }]
                })

            expect(response.status).to.equal(200)

            expect(Array.isArray(response.body)).to.equal(true)

            expect(response.body[0].title).to.equal('RPI Course Catalog')
        });
    })
})