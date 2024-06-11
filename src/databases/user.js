const mongoose=require("mongoose")


const schemaData= mongoose.Schema(
    {
      name:String,
      email:String,
      phone:Number,

    },{
        timestamps:true
    }
)
const userModel=mongoose.model("user", schemaData)
module.exports = userModel;