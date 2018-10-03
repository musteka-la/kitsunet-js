'use strict'

const qs = require('querystring')
const kitsunet = require('../kitsunet')

const options = qs(window.location.search)

kitsunet(options)
