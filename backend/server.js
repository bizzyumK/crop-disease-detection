const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config(); 
connectDB();

const app = express();

//middlewares
app.use(cors());
app.use(express.json());

//routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/images', require('./routes/images'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})
