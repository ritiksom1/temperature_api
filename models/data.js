const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
    imei: { type: String, required: true },
    device_id: { type: String, required: true },
    timestamp: { type: String, required: true },
    temperature: { type: String, required: true },
});

module.exports = mongoose.model('Data', DataSchema);
