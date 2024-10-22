require("dotenv").config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Data = require('./models/data');


const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get('/storeData', async (req, res) => {
    try {
        const queryString = req.query.gs;
        if (!queryString) {
            return res.status(400).json({ message: 'Missing gs parameter' });
        }

        // Split the string into components
        const [imei, device_id, timestamp, temperature] = queryString.split('$');

        // Create a new data entry
        const newData = new Data({
            imei,
            device_id,
            timestamp,
            temperature
        });

        // Save to the database
        await newData.save();

        res.status(200).json({ message: 'Data saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

app.get("/getData/:imei", async(req, res) => {
    try{
        const tempData = await Data.find({ imei: req.params.imei });
       
        if(!tempData){
            return res.status(404).json({
                success: false,
                message: "Data Not Found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Data Fetched Successfully",
            tempData
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
});