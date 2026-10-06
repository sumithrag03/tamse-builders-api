const { google } = require("googleapis");
const path = require("path");

const credentialsPath = path.join(
    __dirname,
    "../../google-credentials.json"
);

const auth = new google.auth.GoogleAuth({
    keyFile: credentialsPath,
    scopes: [
        "https://www.googleapis.com/auth/spreadsheets"
    ]
});

const sheets = google.sheets({
    version: "v4",
    auth
});

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

async function addEnquiryToSheet(enquiry) {
    const values = [[
        new Date().toLocaleString("en-IN"),
        enquiry.fullName,
        enquiry.phone,
        enquiry.email,
        enquiry.projectType,
        enquiry.budget,
        enquiry.location,
        enquiry.message,
        "New"
    ]];

    await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: "Sheet1!A:I",
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        requestBody: {
            values
        }
    });

    return true;
}

module.exports = {
    addEnquiryToSheet
};