const mongoose = require('mongoose');
require('dotenv').config();
const Election = require('./src/models/Election');

async function updateElectionStatuses() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Get all elections
        const elections = await Election.find({});
        console.log(`Found ${elections.length} elections`);

        // Update each election (this will trigger the pre-save hook)
        for (const election of elections) {
            const oldStatus = election.status;
            await election.save(); // This triggers the pre-save hook
            console.log(`Updated ${election.title}: ${oldStatus} → ${election.status}`);
        }

        console.log('✅ All elections updated!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

updateElectionStatuses();
