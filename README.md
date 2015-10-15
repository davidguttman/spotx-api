# spotx-api #

A simple module for accessing SpotX report data.

## Example ##

```js
var sx = require('spotx-api')

var creds = {
  "username": "xxx",
  "password": "yyy"
}

var date = '2015-10-10'

sx(creds, date, function (err, rows) {
  if (err) return console.error(err)

  console.log('revenue data', rows)
})

```

# License #

MIT
