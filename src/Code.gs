/*
 * MIT License
 *
 * Copyright (c) 2017 Tech Cooperative (https://techcoop.group)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/*
 * Tech Cooperative - Serverless-Form
 *
 * Full Instructions:
 * https://github.com/techcoop/serverless-form
 *
 * TO USE:
 * 1) Change the values below as needed
 * 2) Make sure SHEET_NAME matches your spreadsheet exactly
 * 3) Click on Publish and select "Deploy as web app"
 * 4) Select new (or save over existing version)
 * 5) In "Execute the app as" select yourself
 * 6) In "Who has access to the app" Select "Anyone, even anonymous"
 * 7) Click Update
 * 8) Copy and paste the URL and use this to post information to
 * 9) Make sure form data fields match the header fields exactly
 *
 * TO TEST:
 * 1) Change the testData in test_post()
 * 2) Move to Run in the top menu)
 * 3) Click function test_post()
 *
 * Credits:
 * https://github.com/dwyl/html-form-send-email-via-google-script-without-server
 *
 */

// TODO an actual data validation setup
// TODO test injection techniques, google probably handling properly

var SHEET_NAME           = 'responses';  // CONFIGURE - The name of the sheet in your spreadsheet
var NOTIFICATION_EMAIL   = '';           // CONFIGURE - Should match the google account you are using
var NOTIFICATION_ENABLED = true;         // Should set to false if you do not want to email
var DEBUG                = false;        // Should set to true if you want to log to console

// CONFIGURE - Change these values as needed, they should match your form fields with sensible test data
var testData = {
  email: NOTIFICATION_EMAIL,  // Can change this too
  name: 'Some Guy',
  company_name: 'Some Company',
  description: 'Test Descriptions',
  training: 'on',
  placements: 'on',
  assessments: 'on',
  architecture: 'on',
  optimization: 'on',
  automation: 'on',
  prototyping: 'on'
}

function test_post() {
  if (!DEBUG) {
    Logger.log('Warning, you are running test_post with DEBUG turned off!')
  }

  doPost({ parameters: testData })
}

function doPost(e) {
  try {
    // Make sure there's an email
    if (e.parameters.email === undefined || e.parameters.email === '') {
      return handleError('You must provide an email address so that we can get in touch with you.');
    }

    // Get sheet references
    try {
      var doc = SpreadsheetApp.getActiveSpreadsheet();
      var sheet = doc.getSheetByName(SHEET_NAME); // select the responses sheet
    } catch(error) {
      Logger.log(error)
      return handleError('Error thrown doc or spreadhseet: ' + SHEET_NAME);
    }

    if (sheet === null) {
      return handleError('Could not find sheet: ' + SHEET_NAME);
    }

    // Get fields from first row of sheet
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nextRow = sheet.getLastRow() + 1;

    var row = [];
    var mailBody = '';
    for (var i = 0; i < headers.length; i++) {
      var value;
      if (e.parameters[headers[i]] !== undefined) {
        value = e.parameters[headers[i]]
      } else if (headers[i] === 'timestamp'){
        value = new Date();
      } else {
        value = '';
      }

      row.push(value);
      mailBody += mailRow(headers[i], value);
    }

    // Write to sheet
    sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);
    Logger.log(e.parameters.name)
    // If notifcation, send email
    if (NOTIFICATION_ENABLED) {
      MailApp.sendEmail({
        to: NOTIFICATION_EMAIL,
        subject: 'New Request' + (e.parameters.name ? ' ' + e.parameters.name : ''),
        replyTo: String(e.parameters.email),
        htmlBody: mailBody
      });
    }

    var message = 'Thank you for your request.  We will be in touch soon.'
    return handleSuccess(message)

  } catch(error) {
    var message = 'Unknown error ocurred'
    Logger.log(error);
    return handleError(message, {request: e, error: error})
  }
}


// ***** Utility functions *****

// Forms a basic content row for email
function mailRow(name, value) {
  return '<h3 style="text-transform: capitalize; margin-bottom: 0">' + name + '</h3><div>' + value + '</div>'
}

// Gets response from object
function getResponse(data) {
   return ContentService
          .createTextOutput(JSON.stringify(data))
          .setMimeType(ContentService.MimeType.JSON);
}

// Wraps error
function handleError(message, data) {
  var error = {status: 'error', message: message}
  if (data) {
    error['data'] = data
  }

  if (DEBUG) {
    Logger.log(error)
  }

  return getResponse(error)
}

// Wraps success
function handleSuccess(message, data) {
  var success = {status: 'success', message: message}
  if (data) {
    success['data'] = data
  }

  if (DEBUG) {
    Logger.log(success)
  }

  return getResponse(success)
}
