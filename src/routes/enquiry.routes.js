const express = require("express");
const router = express.Router();

const { addEnquiryToSheet } = require("../services/googleSheets");

const {
    sendOwnerEmail,
    sendClientEmail
} = require("../services/emailService");


// ========================================
// POST /api/enquiry
// ========================================
router.post("/", async (req, res) => {

    try {

        // ----------------------------------------
        // Get enquiry data from frontend
        // ----------------------------------------
        const {
            fullName,
            email,
            phone,
            projectType,
            budget,
            location,
            message
        } = req.body;


        // ----------------------------------------
        // Validate required fields
        // ----------------------------------------
        if (
            !fullName ||
            !email ||
            !phone ||
            !projectType ||
            !budget ||
            !location ||
            !message
        ) {

            return res.status(400).json({
                success: false,
                message: "Please fill in all required fields."
            });

        }


        // ----------------------------------------
        // Save enquiry to Google Sheets
        // ----------------------------------------
        await addEnquiryToSheet({
            fullName,
            email,
            phone,
            projectType,
            budget,
            location,
            message
        });


        // ----------------------------------------
        // Send email to TAMSE owner
        // ----------------------------------------
        await sendOwnerEmail({
            fullName,
            email,
            phone,
            projectType,
            budget,
            location,
            message
        });


        // ----------------------------------------
        // Send confirmation email to client
        // ----------------------------------------
        await sendClientEmail({
            fullName,
            email,
            phone,
            projectType,
            budget,
            location,
            message
        });


        // ----------------------------------------
        // Success response
        // ----------------------------------------
        return res.status(201).json({
            success: true,
            message: "Enquiry submitted successfully."
        });


    } catch (error) {

        // ----------------------------------------
        // Error handling
        // ----------------------------------------
        console.error("Enquiry error:", error);


        return res.status(500).json({
            success: false,
            message: "Failed to process enquiry."
        });

    }

});


module.exports = router;