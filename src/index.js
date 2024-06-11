const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const app=express()
const collection=require("./databases/user")
app.use(cors())
app.use(express.json())

//read
app.get("/",async(req,res)=>{
    const data=await collection.find({})
    res.json({success:true,data:data})
    
})
//create
app.post("/create",async(req,res)=>{
    console.log(req.body)
    const data=  new collection(req.body)
    await data.save()
    res.send({success:true,status:"created succesully",data:data})

})
//update
app.put("/update",async(req,res)=>{
    const {id,...rest}=req.body
    const data =await collection.updateOne({_id:id},rest)
    res.send({success:true,status:"updated succesully",data:data})
})
//delete

app.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;
    const data = await collection.deleteOne({ _id: id });
    res.send({ success: true, status: "deleted succesfully", data: data });
  });



///connection
const PORT=process.env.PORT||9000
mongoose.connect("mongodb://localhost:27017/crudoperation", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Connected to database");

    app.listen(PORT, () => {
        console.log("Connected successfully to the port:", PORT);
    });
})
.catch((err) => {
    console.log(err);
});