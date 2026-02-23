const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require("./routes/auth");
const errorHandler = require('./middleware/errormiddleware');
const cookieParser = require('cookie-parser');


dotenv.config();
connectDB();

const app = express();

// ✅ CRITICAL: Apply middleware in correct order
// 1. CORS first
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// 2. Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Cookie parser
app.use(cookieParser());

// 4. Routes
app.use("/api/auth", authRoutes);
app.use("/api/builder-resume", require("./routes/resumebuilder"));

// 5. Error handler last
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('ResumeApt Backend Running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

