# form-google-sheets
[![Maintenance Status][status-image]][status-url] [![NPM version][npm-image]][npm-url] [![Travis build][travis-image]][travis-url]

Uses Google Apps Scripts with Google Sheets to provide a POST endpoint for form 
data that is parsed into sheet fields.

https://techcoop.github.io/form-google-sheets/

# Requirements

1) Google Account
2) Google Sheet with column headers
3) node > 6.0.0 (Optional)
4) yarn (or npm latest) > 0.10.0 (Optional)

# Installation

### Google Scripts
1) Change the values below as needed
2) Make sure SHEET_NAME matches your spreadsheet exactly
3) Click on Publish and select "Deploy as web app"
4) Select new (or save over existing version)
5) In "Execute the app as" select yourself
6) In "Who has access to the app" Select "Anyone, even anonymous"
7) Click Update
8) Copy and paste the URL and use this to post information to
9) Make sure form data fields match the header fields exactly

### NPM package

```bash
yarn add form-google-sheets
```
# Usage

### ES6
```javascript
import { Form } from 'form-google-sheets'

const endpoint = 'https://script.google.com/macros/s/AKfycbyEBGqfIUmxrLKMp_LlAlH8C_VO9vfRvtvwgjAS9lEi8Vu8xho/exec'
const form = new Form(endpoint).then((event) => {
  console.log('SUCCESS')
  console.log(event)
}).catch((event) => {
  console.log('ERROR')
  console.log(event)
})
```

### Node
```javascript
var Form = require('form-google-sheets').Form

var endpoint = 'https://script.google.com/macros/s/AKfycbyEBGqfIUmxrLKMp_LlAlH8C_VO9vfRvtvwgjAS9lEi8Vu8xho/exec'
var form = new Form(endpoint).then((event) => {
  console.log('SUCCESS')
  console.log(event)
}).catch((event) => {
  console.log('ERROR')
  console.log(event)
})
```

### Javascript
```html
<script src="form-google-sheets.js"></script>
```

```javascript
var endpoint = 'https://script.google.com/macros/s/AKfycbyEBGqfIUmxrLKMp_LlAlH8C_VO9vfRvtvwgjAS9lEi8Vu8xho/exec'
var form = new FormGoogleSheets.Form(endpoint).then(function(event) {
  console.log('SUCCESS')
  console.log(event)
}).catch(function(event) {
  console.log('ERROR')
  console.log(event)
})
```

# Testing

### Google Scripts
There is a test function setup that you can change to include your own fields and make sure your form is setup correctly.

1) Change the testData in test_post()
2) Move to Run in the top menu
3) Click function test_post()

### Client library

```bash
# Run unit test
yarn test
```

# Releasing
```bash
# Create new versioned release
yarn run release
```

# Examples

You can see examples of use in javascript under /docs.

You can see the (view only) sheet that this posts to here:
https://docs.google.com/spreadsheets/d/1SRRfFOpIJyW6tZB1TP3wJf01CFISviIMFEJDgwoqq5w/edit?usp=sharing

# Original Source
https://github.com/dwyl/html-form-send-email-via-google-script-without-server

# Contributing
All contributors are welcome, please follow [CONTRIBUTING.md](guidelines)

# Contributors
[colin@techcoop.group](admin) 

[admin]: https://github.com/colingagnon

[status-image]: https://img.shields.io/badge/status-maintained-brightgreen.svg
[status-url]: https://github.com/techcoop/form-google-sheets

[npm-image]: https://img.shields.io/npm/v/form-google-sheets.svg
[npm-url]: https://www.npmjs.com/package/form-google-sheets

[travis-image]: https://travis-ci.org/techcoop/form-google-sheets.svg?branch=master
[travis-url]: https://travis-ci.org/techcoop/form-google-sheets

[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: https://raw.githubusercontent.com/techcoop/form-google-sheets/master/LICENSE

