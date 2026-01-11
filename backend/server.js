const express = require ('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const imageRoutes = require('./routes/images');

dotenv.config(); //load environment variables

const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

//routes
app.use('/api/auth',require('./routes/auth'));

app.get('/',(req,res)=>{
  res.send({message: 'Hello World!'});
});

app.use('/api/images',imageRoutes);

// Global error handler (handles Multer and other errors)
app.use((err, req, res, next) => {
  console.error(err);
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({message: 'File too large. Max size is 5MB.'});
    }
    return res.status(400).json({message: err.message});
  }

  if (err && err.message && err.message.includes('Only images')) {
    return res.status(400).json({message: err.message});
  }

  res.status(500).json({message: 'Server Error'});
});

mongoose
.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected!"))
.catch((err)=>console.error(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
  console.log(`Server is running at http://localhost:${PORT}`);
})