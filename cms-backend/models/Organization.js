// models/Organization.js
const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema({
  organizationName: {
    type: String,
    required: true,
    unique: true,
  },
  organizationCode: {
    type: String,
    required: true,
    unique: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Organization', OrganizationSchema);
