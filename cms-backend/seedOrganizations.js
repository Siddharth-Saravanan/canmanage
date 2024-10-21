// seedOrganizations.js
const mongoose = require('mongoose');
const Organization = require('./models/Organization');

mongoose.connect('mongodb://localhost:27017/canmanage', { useNewUrlParser: true, useUnifiedTopology: true });

const organizations = [
  { organizationName: 'Amrita Vishwa Vidyapeetham', organizationCode: 'AVV123' }
  // Add more organizations as needed
];

async function seedOrganizations() {
  try {
    await Organization.insertMany(organizations);
    console.log('Organizations added successfully.');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error adding organizations:', error);
  }
}

seedOrganizations();
