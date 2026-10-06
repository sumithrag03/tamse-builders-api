const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

// Send enquiry notification to TAMSE owner
async function sendOwnerEmail(enquiry) {
    const { data, error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to: [process.env.TAMSE_EMAIL],

        subject: `New Enquiry - ${enquiry.fullName}`,

        html: `
            <h2>New TAMSE Builders Enquiry</h2>

            <p><strong>Name:</strong> ${enquiry.fullName}</p>
            <p><strong>Email:</strong> ${enquiry.email}</p>
            <p><strong>Phone:</strong> ${enquiry.phone}</p>
            <p><strong>Project Type:</strong> ${enquiry.projectType}</p>
            <p><strong>Budget:</strong> ${enquiry.budget}</p>
            <p><strong>Project Location:</strong> ${enquiry.location}</p>
            <p><strong>Project Details:</strong> ${enquiry.message}</p>

            <hr>

            <p>
                This enquiry was submitted through the
                TAMSE Builders website.
            </p>
        `
    });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}


// Send confirmation email to client
async function sendClientEmail(enquiry) {
    const { data, error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to: [enquiry.email],

        subject: "Thank You for Contacting TAMSE Builders",

        html: `
            <h2>Thank You, ${enquiry.fullName}!</h2>

            <p>
                Thank you for contacting
                <strong>TAMSE Builders</strong>.
            </p>

            <p>
                We have successfully received your enquiry.
                Our team will review your requirements and
                get back to you soon.
            </p>

            <h3>Your Enquiry Details</h3>

            <p><strong>Project Type:</strong> ${enquiry.projectType}</p>
            <p><strong>Budget:</strong> ${enquiry.budget}</p>
            <p><strong>Project Location:</strong> ${enquiry.location}</p>
            <p><strong>Project Details:</strong> ${enquiry.message}</p>

            <hr>

            <p>
                Regards,<br>
                <strong>TAMSE Builders</strong>
            </p>

            <p>
                This is an automated confirmation email.
                Please do not reply to this email.
            </p>
        `
    });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}


module.exports = {
    sendOwnerEmail,
    sendClientEmail
};