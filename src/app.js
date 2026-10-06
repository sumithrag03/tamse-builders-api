const express = require("express");
const cors = require("cors");

const enquiryRoutes = require("./routes/enquiry.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "TAMSE Builders API is running"
    });
});

app.use("/api/enquiry", enquiryRoutes);

module.exports = app;