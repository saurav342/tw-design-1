require('dotenv').config();
const { connectDB } = require('../config/database');
const User = require('../models/schemas/User');
const bcrypt = require('bcryptjs');

const ensureAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = 'admin@launchandlift.com';
    const adminPassword = 'LaunchAndLiftAdmin!23';

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists:', adminEmail);
      
      // Verify the password is correct (update if needed)
      const passwordValid = await bcrypt.compare(adminPassword, existingAdmin.passwordHash);
      if (!passwordValid) {
        console.log('⚠️  Admin password is incorrect. Updating password...');
        existingAdmin.passwordHash = await bcrypt.hash(adminPassword, 10);
        existingAdmin.role = 'admin'; // Ensure role is correct
        await existingAdmin.save();
        console.log('✅ Admin password updated successfully');
      } else {
        console.log('✅ Admin credentials are correct');
      }
      
      // Ensure role is admin
      if (existingAdmin.role !== 'admin') {
        console.log('⚠️  Admin role is incorrect. Updating role...');
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✅ Admin role updated successfully');
      }
      
      process.exit(0);
    }

    // Create admin user if it doesn't exist
    console.log('Creating admin user...');
    const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
    const adminUser = new User({
      fullName: 'Launch & Lift Admin',
      email: adminEmail,
      passwordHash: adminPasswordHash,
      role: 'admin',
      organization: 'Launch & Lift',
      adminDetails: { department: 'Operations' },
    });
    await adminUser.save();
    console.log('✅ Admin user created successfully:', adminEmail);
    console.log('   Password:', adminPassword);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error ensuring admin user:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  ensureAdmin();
}

module.exports = { ensureAdmin };

