var request = require('request')
var AsyncCache = require('async-cache')
var jar = request.jar()

var loginCache = new AsyncCache({
  maxAge: 1000 * 60 * 60,
  load: function (key, cb) {
    var creds = JSON.parse(key)
    login(creds, cb)
  }
})

var urlBase = 'https://publisher-api.spotxchange.com/1.0/'

module.exports = function (creds, date, cb) {
  loginWithCache(creds, function (err, publisherId) {
    if (err) return cb(err)

    getDateRevenue(publisherId, date, cb)
  })
}

function loginWithCache (creds, cb) {
  var key = JSON.stringify(creds)
  loginCache.get(key, cb)
}

function login (creds, cb) {
  var urlLogin = urlBase + 'Publisher/Login'

  var opts = {
    url: urlLogin,
    headers: getHeaders(),
    method: 'POST',
    json: creds,
    jar: jar
  }

  request(opts, function (err, res, body) {
    if (err) return cb(err)
    if (res.statusCode >= 400) {
      return cb(new Error(['statusCode', res.statusCode, opts.url].join(' ')))
    }

    var publisherId = (((body || {}).value || {}).publisher || {}).publisher_id
    if (!publisherId) return cb(new Error('Could not get publisher_id'))
    cb(null, publisherId)
  })
}

function getDateRevenue (publisherId, date, cb) {
  var urlRev = urlBase + 'Publisher(' + publisherId + ')/Channels/RevenueReport'

  var opts = {
    method: 'GET',
    headers: getHeaders(),
    url: urlRev,
    jar: jar,
    json: true,
    qs: {
      date_range: [date, date].join('|')
    }
  }

  request(opts, function (err, res, body) {
    if (err) return cb(err)
    if (res.statusCode >= 400) {
      return cb(new Error(['statusCode', res.statusCode, opts.url].join(' ')))
    }
    var rows = ((body || {}).value || {}).data
    cb(null, rows)
  })
}

function getHeaders () {
  return { 'User-Agent' : 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.6) Gecko/20070725 Firefox/2.0.0.6' }
}
