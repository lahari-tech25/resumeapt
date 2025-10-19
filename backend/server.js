const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require("./routes/auth");
const errorHandler = require('./middleware/errormiddleware');


//connect to database
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Error Middleware
app.use(errorHandler);

// Routes
app.use("/api/auth", authRoutes);


app.get('/', (req, res) => {
  res.send('ResumeApt Backend Running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


