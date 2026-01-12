const Advisory = require('../models/Advisory');

// GET /api/advisory/:disease

const getAdviceByDisease = async (req,res)=>{
  try{
    const {disease} = req.params; //get disease from url

    const advisory = await Advisory.findOne({disease}); // look for advice in DB

    if(!advisory){
      return res.send(404).json({message: "Advice not found for this disease!"});
    }

    res.status(200).json({
      disease: advisory.disease,
      advice: advisory.advice
    });

  } catch(error){
    console.error(error);
    res.status(500).json({message: "Server error"});
  }
};

module.exports = {getAdviceByDisease};