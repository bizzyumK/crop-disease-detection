const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const farmerSchema = new mongoose.Schema({

  name :{
    type : String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
     match: [/^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/
, "Invalid email format"] 
  },

  password: {
    type: String,
    match: [
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,"Invalid PWD Format"],
    required: true,
  },

},{timestamps:true});


//hashing before saving
farmerSchema.pre("save",async function(){

  if(!this.isModified("password")){
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password,salt);

});

//if not modified compare pwd for login

farmerSchema.methods.matchPassword = async function(enteredPwd){
  return await bcrypt.compare(enteredPwd, this.password);
};

module.exports = mongoose.model("Farmer",farmerSchema);
