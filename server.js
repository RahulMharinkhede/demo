const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public')); // Serve static files from public directory

// Create data directory if it doesn't exist
const DATA_DIR = path.join(__dirname, 'data');
const FEEDBACK_FILE = path.join(DATA_DIR, 'feedback.json');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');

async function ensureDataDirectory() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        
        // Initialize feedback file if it doesn't exist
        try {
            await fs.access(FEEDBACK_FILE);
        } catch {
            await fs.writeFile(FEEDBACK_FILE, JSON.stringify([], null, 2));
        }
        
        // Initialize submissions tracking file
        try {
            await fs.access(SUBMISSIONS_FILE);
        } catch {
            await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify({
                totalSubmissions: 0,
                submissions: [],
                lastUpdated: new Date().toISOString()
            }, null, 2));
        }
    } catch (error) {
        console.error('Error creating data directory:', error);
    }
}

// Employee data (matching your HTML file)
const employees = [
    {id: 1, name: 'Jitendra Nikhade', number: 1, designation: 'Office Superintendent'},
    {id: 2, name: 'Surekha Pande', number: 2, designation: 'Office Superintendent'},
    {id: 3, name: 'Dattatray Raut', number: 3, designation: 'Office Superintendent'},
    {id: 4, name: 'Kalpana Chandele', number: 4, designation: 'Assistant Superintendent'},
    {id: 5, name: 'Nilesh Shekar', number: 5, designation: 'Legal Advisor'},
    {id: 6, name: 'Pawan Kulthe', number: 6, designation: 'Assistant Superintendent'},
    {id: 7, name: 'Nitin Ambade', number: 7, designation: 'Assistant Superintendent'},
    {id: 8, name: 'Kiran Supe', number: 8, designation: 'Assistant Superintendent'},
    {id: 9, name: 'Hemant Kadnake', number: 9, designation: 'Assistant Superintendent'},
    {id: 10, name: 'Naresh Nikhare', number: 10, designation: 'Assistant Superintendent'},
    {id: 11, name: 'Madhuri Nimkar', number: 11, designation: 'Assistant Superintendent'},
    {id: 12, name: 'Kishor Eknar', number: 12, designation: 'Assistant Superintendent'},
    {id: 13, name: 'Bhagwan Chandrawanshi', number: 13, designation: 'Assistant Superintendent'},
    {id: 14, name: 'Abhijeet Tekam', number: 14, designation: 'Higher-Grade Stenographer'},
    {id: 16, name: 'Prakash Bonde', number: 16, designation: 'Senior Clerk'},
    {id: 17, name: 'Rushikesh Pullarwar', number: 17, designation: 'Senior Clerk'},
    {id: 18, name: 'Priya Lekurwale', number: 18, designation: 'Senior Clerk'},
    {id: 19, name: 'Dipak Dafade', number: 19, designation: 'Senior Clerk'},
    {id: 20, name: 'Shalini Kasare', number: 20, designation: 'Senior Clerk'},
    {id: 21, name: 'Samir Kahile', number: 21, designation: 'Senior Clerk'},
    {id: 22, name: 'Sachin Meshram', number: 22, designation: 'Senior Clerk'},
    {id: 23, name: 'Chandrakant Kubade', number: 23, designation: 'Senior Clerk'},
    {id: 24, name: 'Kavita Patil', number: 24, designation: 'Senior Clerk'},
    {id: 25, name: 'Nayankumar Hargule', number: 25, designation: 'Senior Clerk'},
    {id: 26, name: 'Parmeshwar Ambore', number: 26, designation: 'Senior Clerk'},
    {id: 27, name: 'Nitish Halde', number: 27, designation: 'Junior Clerk'},
    {id: 28, name: 'Ajay Mahadole', number: 28, designation: 'Junior Clerk'},
    {id: 29, name: 'Mohan Nagpure', number: 29, designation: 'Junior Clerk'},
    {id: 30, name: 'Paritosh Shukla', number: 30, designation: 'Junior Clerk'},
    {id: 31, name: 'Antariksh Kumbhare', number: 31, designation: 'Junior Clerk'},
    {id: 32, name: 'Shweta Lokhande', number: 32, designation: 'Junior Clerk'},
    {id: 33, name: 'Bharat Nimaje', number: 33, designation: 'Junior Clerk'},
    {id: 34, name: 'Chandrashekhar Ukey', number: 34, designation: 'Pharmacy Officer'},
    {id: 35, name: 'Navkiran Kshiraskar', number: 35, designation: 'Pharmacy Officer'},
    {id: 36, name: 'Prasanna Waradpande', number: 36, designation: 'Telephone Operator'},
    {id: 37, name: 'Vijay Dhage', number: 37, designation: 'Bio-medical Engg.'},
    {id: 38, name: 'Manoj Shriwastav', number: 38, designation: 'Technician'},
    {id: 39, name: 'Vilash Kedar', number: 39, designation: 'Technician'},
    {id: 40, name: 'Gauri Zade', number: 40, designation: 'Technician'},
    {id: 41, name: 'Santosh Ghatol', number: 41, designation: 'Technician'},
    {id: 42, name: 'Hemant Bendale', number: 42, designation: 'Technician'},
    {id: 43, name: 'Shubham Pajgade', number: 43, designation: 'Unskill Artizen'},
    {id: 44, name: 'Vikas Nandurkar', number: 44, designation: 'Unskill Artizen'},
    {id: 45, name: 'Najim Patel', number: 45, designation: 'Junior Technical Assistant'},
    {id: 46, name: 'Rahul Harinkhede', number: 46, designation: 'Statistical Assistant'},
    {id: 47, name: 'Suraj Phule', number: 47, designation: 'Statistical Investigator'},
    {id: 48, name: 'Prakash Tembhurne', number: 48, designation: 'Health Inspector'},
    {id: 49, name: 'Sanjay Malwe', number: 49, designation: 'Health Inspector'},
    {id: 50, name: 'Pradeep Wagh', number: 50, designation: 'Health Inspector'},
    {id: 51, name: 'Madhukar Tikhe', number: 51, designation: 'Health Inspector'},
    {id: 52, name: 'Suraj Dhone', number: 52, designation: 'Pharmacy Officer'},
    {id: 53, name: 'Sandeep Wadibhasme', number: 53, designation: 'Pharmacy Officer'},
    {id: 74, name: 'Vilas Shette', number: 74, designation: 'Junior Clerk'}
];

// Validation functions
function validateEmployee(number, name) {
    const employee = employees.find(emp => emp.number === number);
    if (!employee) {
        return { valid: false, message: 'Employee number not found' };
    }
    if (employee.name.toLowerCase() !== name.toLowerCase()) {
        return { valid: false, message: 'Name does not match employee number' };
    }
    return { valid: true, employee };
}

function validateRatings(ratings, evaluatorId) {
    const expectedCount = employees.length - 1; // Exclude self
    const receivedCount = Object.keys(ratings).length;
    
    if (receivedCount !== expectedCount) {
        return { 
            valid: false, 
            message: `Expected ${expectedCount} ratings, received ${receivedCount}` 
        };
    }
    
    // Check if evaluator is rating themselves
    if (ratings[evaluatorId]) {
        return { 
            valid: false, 
            message: 'Cannot rate yourself' 
        };
    }
    
    // Validate rating values
    for (const [employeeId, rating] of Object.entries(ratings)) {
        const ratingValue = parseInt(rating);
        if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 10) {
            return { 
                valid: false, 
                message: `Invalid rating value: ${rating} for employee ${employeeId}` 
            };
        }
    }
    
    return { valid: true };
}

function validateReasons(ratings, reasons) {
    const ratingsNeedingReasons = Object.entries(ratings).filter(
        ([id, rating]) => parseInt(rating) <= 3 || parseInt(rating) >= 9
    );
    
    for (const [employeeId, rating] of ratingsNeedingReasons) {
        if (!reasons[employeeId] || reasons[employeeId].trim() === '') {
            const employee = employees.find(e => e.id == employeeId);
            return { 
                valid: false, 
                message: `Reason required for ${employee?.name || 'Employee #' + employeeId} (rating: ${rating})` 
            };
        }
    }
    
    return { valid: true };
}

// API Routes

// Submit feedback
app.post('/api/feedback', async (req, res) => {
    try {
        const { evaluator, ratings, reasons, timestamp } = req.body;
        
        // Validate request body
        if (!evaluator || !ratings || !timestamp) {
            return res.status(400).json({ 
                error: 'Missing required fields: evaluator, ratings, timestamp' 
            });
        }
        
        // Validate employee
        const employeeValidation = validateEmployee(evaluator.number, evaluator.name);
        if (!employeeValidation.valid) {
            return res.status(400).json({ error: employeeValidation.message });
        }
        
        // Validate ratings
        const ratingsValidation = validateRatings(ratings, evaluator.id);
        if (!ratingsValidation.valid) {
            return res.status(400).json({ error: ratingsValidation.message });
        }
        
        // Validate reasons
        const reasonsValidation = validateReasons(ratings, reasons || {});
        if (!reasonsValidation.valid) {
            return res.status(400).json({ error: reasonsValidation.message });
        }
        
        // Check for duplicate submission
        const existingFeedback = await fs.readFile(FEEDBACK_FILE, 'utf8');
        const feedbackData = JSON.parse(existingFeedback);
        
        const existingSubmission = feedbackData.find(
            submission => submission.evaluator.id === evaluator.id
        );
        
        if (existingSubmission) {
            return res.status(409).json({ 
                error: 'Feedback already submitted by this employee',
                submittedAt: existingSubmission.completedAt 
            });
        }
        
        // Prepare feedback entry
        const feedbackEntry = {
            id: Date.now().toString(),
            evaluator: {
                id: evaluator.id,
                name: evaluator.name,
                number: evaluator.number,
                designation: employeeValidation.employee.designation
            },
            ratings,
            reasons: reasons || {},
            timestamp,
            completedAt: new Date().toLocaleString('en-IN', { 
                timeZone: 'Asia/Kolkata',
                dateStyle: 'full',
                timeStyle: 'medium'
            }),
            serverTimestamp: new Date().toISOString(),
            metadata: {
                totalRatings: Object.keys(ratings).length,
                lowScores: Object.values(ratings).filter(r => parseInt(r) <= 3).length,
                highScores: Object.values(ratings).filter(r => parseInt(r) >= 9).length,
                averageRating: (Object.values(ratings).reduce((sum, r) => sum + parseInt(r), 0) / Object.keys(ratings).length).toFixed(2)
            }
        };
        
        // Save feedback
        feedbackData.push(feedbackEntry);
        await fs.writeFile(FEEDBACK_FILE, JSON.stringify(feedbackData, null, 2));
        
        // Update submissions tracking
        const submissionsData = JSON.parse(await fs.readFile(SUBMISSIONS_FILE, 'utf8'));
        submissionsData.totalSubmissions++;
        submissionsData.submissions.push({
            employeeId: evaluator.id,
            employeeName: evaluator.name,
            submittedAt: feedbackEntry.serverTimestamp
        });
        submissionsData.lastUpdated = new Date().toISOString();
        
        await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify(submissionsData, null, 2));
        
        console.log(`✅ Feedback submitted by ${evaluator.name} (ID: ${evaluator.id})`);
        
        res.status(200).json({
            success: true,
            message: 'Feedback submitted successfully',
            submissionId: feedbackEntry.id,
            metadata: feedbackEntry.metadata
        });
        
    } catch (error) {
        console.error('Error saving feedback:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: 'Failed to save feedback' 
        });
    }
});

// Get submission statistics
app.get('/api/stats', async (req, res) => {
    try {
        const submissionsData = JSON.parse(await fs.readFile(SUBMISSIONS_FILE, 'utf8'));
        const totalEmployees = employees.length;
        
        res.json({
            totalEmployees,
            totalSubmissions: submissionsData.totalSubmissions,
            remainingSubmissions: totalEmployees - submissionsData.totalSubmissions,
            completionPercentage: ((submissionsData.totalSubmissions / totalEmployees) * 100).toFixed(1),
            lastUpdated: submissionsData.lastUpdated
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// Check if employee has already submitted
app.get('/api/check-submission/:employeeNumber', async (req, res) => {
    try {
        const employeeNumber = parseInt(req.params.employeeNumber);
        const employee = employees.find(emp => emp.number === employeeNumber);
        
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        
        const feedbackData = JSON.parse(await fs.readFile(FEEDBACK_FILE, 'utf8'));
        const existingSubmission = feedbackData.find(
            submission => submission.evaluator.id === employee.id
        );
        
        res.json({
            hasSubmitted: !!existingSubmission,
            submittedAt: existingSubmission?.completedAt || null,
            employee: {
                id: employee.id,
                name: employee.name,
                designation: employee.designation
            }
        });
    } catch (error) {
        console.error('Error checking submission:', error);
        res.status(500).json({ error: 'Failed to check submission status' });
    }
});

// Get all employees (for admin use)
app.get('/api/employees', (req, res) => {
    res.json(employees);
});

// Admin route to view all feedback (basic implementation)
app.get('/api/admin/feedback', async (req, res) => {
    try {
        // Simple authentication - in production, use proper authentication
        const authToken = req.headers.authorization;
        if (authToken !== 'Bearer admin123') {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        const feedbackData = JSON.parse(await fs.readFile(FEEDBACK_FILE, 'utf8'));
        res.json(feedbackData);
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({ error: 'Failed to fetch feedback data' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        totalEmployees: employees.length
    });
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        message: err.message 
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Initialize and start server
async function startServer() {
    await ensureDataDirectory();
    
    app.listen(PORT, () => {
        console.log(`🚀 Employee Feedback System Server running on port ${PORT}`);
        console.log(`📊 Total employees in system: ${employees.length}`);
        console.log(`💾 Data directory: ${DATA_DIR}`);
        console.log(`🌐 Access the application at: http://localhost:${PORT}`);
    });
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('📴 Server shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('📴 Server shutting down gracefully...');
    process.exit(0);
});

startServer().catch(error => {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
});
