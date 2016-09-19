var assert = require('assert');

describe('node-quarium', function() {
    describe('serialProbe', function() {
        let serialProbe = require('../libs/serialProbe');

        describe('parseRawReadingFromFile', function() {
            it('should parse an int from the w1_slave file', function(done) {
                // Value is hard-code in dummy file w1_slave which reflects the format of the w1_slave file on a raspberry pi
                serialProbe.parseRawReadingFromFile('./tests/data/w1_slave', function(err, output) {
                    assert.equal(err, undefined);
                    assert.equal(output, 20687);
                    done();
                })
            })

            it('should return an error for the first line reads "NO"', function(done) {
                serialProbe.parseRawReadingFromFile('./tests/data/w1_slave_no', function(err, output) {
                    assert(err);
                    done();
                })
            })
        })
    })
})