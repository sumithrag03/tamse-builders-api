const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");


// ========================================
// Google Service Account Authentication
// ========================================

let auth;


// ========================================
// Production: Render
// ========================================

if (process.env.GOOGLE_SERVICE_ACCOUNT_BASE64) {

    const credentialsJson = Buffer.from(
        process.env.GOOGLE_SERVICE_ACCOUNT_BASE64,
        "base64"
    ).toString("utf8");

    const credentials = JSON.parse(credentialsJson);

    auth = new google.auth.GoogleAuth({
        credentials,
        scopes: [
            "https://www.googleapis.com/auth/spreadsheets"
        ]
    });

}


// ========================================
// Local Development
// ========================================

else {

    const credentialsPath = path.join(
        __dirname,
        "../../google-credentials.json"
    );

    if (!fs.existsSync(credentialsPath)) {

        throw new Error(
            "Google credentials not found. " +
            "Set GOOGLE_SERVICE_ACCOUNT_BASE64 for production " +
            "or provide google-credentials.json locally."
        );

    }

    auth = new google.auth.GoogleAuth({
        keyFile: credentialsPath,
        scopes: [
            "https://www.googleapis.com/auth/spreadsheets"
        ]
    });

}


// ========================================
// Google Sheets Client
// ========================================

const sheets = google.sheets({
    version: "v4",
    auth
});


// ========================================
// Spreadsheet ID
// ========================================

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;


// ========================================
// Add Enquiry to Google Sheet
// ========================================

async function addEnquiryToSheet(enquiry) {

    const values = [[

        // India Standard Time (IST)
        new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata"
        }),

        enquiry.fullName,

        enquiry.phone,

        enquiry.email,

        enquiry.projectType,

        enquiry.budget,

        enquiry.location,

        enquiry.message,

        "New"

    ]];


    // ========================================
    // Append enquiry to Google Sheet
    // ========================================

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


// ========================================
// Export
// ========================================

module.exports = {
    addEnquiryToSheet
};