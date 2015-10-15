var sx = require('../')

var creds = require('./creds.json')

var date1 = '2015-10-10'
var date2 = '2015-10-11'

console.time('request1')
sx(creds, date1, function (err, rows) {
  if (err) return console.error(err)
  console.timeEnd('request1')
  console.log('rows1', rows.length)

  console.time('request2')
  sx(creds, date2, function (err, rows) {
    if (err) return console.error(err)
    console.timeEnd('request2')
    console.log('rows2', rows.length)
  })
})
