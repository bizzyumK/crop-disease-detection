const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const imageRoutes = require('./routes/images');

dotenv.config(); //load environment variables

const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

//routes
app.use('/api/auth',require('./routes/auth'));
app.use('/api/images',imageRoutes);
app.use('/api/advisory',require('./routes/advisory'));

app.get('/',(req,res)=>{
  res.send({message: 'Hello World!'});
});

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected!"))
    .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})
