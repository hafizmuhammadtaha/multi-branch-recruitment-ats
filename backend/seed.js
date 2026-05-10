require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/user.model');
const Branch = require('./src/models/branch.model');
const Job = require('./src/models/job.model');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    console.log('✅ Connected to MongoDB Atlas');
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    // ── Seed Branches (Required: Islamabad, Lahore, Karachi, Remote) ──
    const branchNames = ['Islamabad', 'Lahore', 'Karachi', 'Remote'];
    const branchDocs = {};
    
    for (const name of branchNames) {
        let branch = await Branch.findOne({ name });
        if (!branch) {
            branch = await Branch.create({ name });
            console.log(`📍 Created branch: ${name}`);
        } else {
            console.log(`📍 Branch already exists: ${name}`);
        }
        branchDocs[name] = branch;
    }

    // ── Seed Admin User ──
    let admin = await User.findOne({ email: 'admin@techvista.com' });
    if (!admin) {
        admin = await User.create({
            name: 'System Admin',
            email: 'admin@techvista.com',
            password: hashedPassword,
            role: 'admin',
            profilePicUrl: 'https://ui-avatars.com/api/?name=System+Admin&background=4f46e5&color=fff&size=400'
        });
        console.log('👤 Created Admin: admin@techvista.com / 123456');
    } else {
        console.log('👤 Admin already exists');
    }

    // ── Seed HR User ──
    let hr = await User.findOne({ email: 'hr@techvista.com' });
    if (!hr) {
        hr = await User.create({
            name: 'HR Manager',
            email: 'hr@techvista.com',
            password: hashedPassword,
            role: 'hr',
            profilePicUrl: 'https://ui-avatars.com/api/?name=HR+Manager&background=0D8ABC&color=fff&size=400'
        });
        console.log('👤 Created HR: hr@techvista.com / 123456');
    } else {
        console.log('👤 HR already exists');
    }

    // ── Seed Candidate User ──
    let candidate = await User.findOne({ email: 'candidate@example.com' });
    if (!candidate) {
        candidate = await User.create({
            name: 'Ali Khan',
            email: 'candidate@example.com',
            password: hashedPassword,
            role: 'candidate',
            profilePicUrl: 'https://ui-avatars.com/api/?name=Ali+Khan&background=10B981&color=fff&size=400'
        });
        console.log('👤 Created Candidate: candidate@example.com / 123456');
    } else {
        console.log('👤 Candidate already exists');
    }

    // ── Seed Sample Jobs ──
    const sampleJobs = [
        { title: 'Senior React Developer', description: 'We are looking for an experienced React developer to join our frontend team. You will be responsible for building modern, responsive web applications using React.js, Redux, and TypeScript.\n\nRequirements:\n• 3+ years of experience with React.js\n• Strong understanding of JavaScript/TypeScript\n• Experience with REST APIs and state management\n• Familiarity with Git and CI/CD pipelines\n• Excellent problem-solving skills', department: 'Engineering', branch: branchDocs['Islamabad']._id, availableSeats: 3 },
        { title: 'Node.js Backend Engineer', description: 'Join our backend team to design and implement scalable APIs and microservices using Node.js and Express.\n\nRequirements:\n• 2+ years of experience with Node.js\n• Proficiency in MongoDB and Mongoose\n• Experience with RESTful API design\n• Knowledge of JWT authentication\n• Understanding of cloud deployment (AWS/GCP)', department: 'Engineering', branch: branchDocs['Lahore']._id, availableSeats: 2 },
        { title: 'UI/UX Designer', description: 'We need a creative UI/UX Designer to create intuitive and visually stunning user interfaces for our web and mobile products.\n\nRequirements:\n• 2+ years of UI/UX design experience\n• Proficiency in Figma or Adobe XD\n• Strong portfolio demonstrating design skills\n• Understanding of user-centered design principles\n• Ability to create wireframes, prototypes, and mockups', department: 'Design', branch: branchDocs['Karachi']._id, availableSeats: 1 },
        { title: 'QA Automation Engineer', description: 'Help us ensure the quality of our software products by developing and maintaining automated test suites.\n\nRequirements:\n• Experience with Selenium, Cypress, or similar tools\n• Knowledge of testing methodologies\n• Ability to write clear and comprehensive test plans\n• Experience with CI/CD integration\n• Strong attention to detail', department: 'QA', branch: branchDocs['Remote']._id, availableSeats: 2 },
        { title: 'DevOps Engineer', description: 'Manage our cloud infrastructure, CI/CD pipelines, and deployment processes to ensure high availability and performance.\n\nRequirements:\n• Experience with Docker and Kubernetes\n• Proficiency in AWS or Azure\n• Knowledge of Linux administration\n• Experience with monitoring tools (Grafana, Prometheus)\n• Scripting skills (Bash, Python)', department: 'DevOps', branch: branchDocs['Islamabad']._id, availableSeats: 1 },
        { title: 'Digital Marketing Specialist', description: 'Drive our online presence through SEO, social media marketing, and content strategy.\n\nRequirements:\n• 2+ years of digital marketing experience\n• Expertise in SEO, SEM, and Google Analytics\n• Experience with social media platforms\n• Content creation and copywriting skills\n• Knowledge of marketing automation tools', department: 'Marketing', branch: branchDocs['Lahore']._id, availableSeats: 2 },
    ];

    const existingJobs = await Job.countDocuments();
    if (existingJobs === 0) {
        await Job.insertMany(sampleJobs);
        console.log(`💼 Created ${sampleJobs.length} sample jobs`);
    } else {
        console.log(`💼 Jobs already exist (${existingJobs} found), skipping seed`);
    }

    console.log('\n🚀 Seed complete! You can now login with:');
    console.log('   Admin:     admin@techvista.com / 123456');
    console.log('   HR:        hr@techvista.com / 123456');
    console.log('   Candidate: candidate@example.com / 123456');

    process.exit(0);
}).catch(err => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
