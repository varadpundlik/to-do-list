const express= require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');

const app=express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static('public'));

mongoose.connect("mongodb://localhost:27017/taskDB")
const taskSchema={
    task:String
}
const taskModel=mongoose.model("item",taskSchema);
const task1=new taskModel({task:"Welcome to to do list"});
const task2=new taskModel({task:"Hit + button to add new task"});
const task3=new taskModel({task:"Press <-- to delete a task"});

const delfaultItems=[task1,task2,task3]


app.get("/",function(req,res){
    var today=new Date();
    var day=today.toLocaleDateString({ "en-IN": "dd-MM-yyyy"});
    taskModel.find(function(err,foundItems){
        if(foundItems.length===0){
            taskModel.insertMany(delfaultItems,function(err){
            if(err){
            console.log(err)
            }
        })
        }
        if(err) console.log(err);
        else {
            res.render('list',{todayDate:day, items:foundItems});
        }
    })
})

app.post("/delete",function(req,res){
    taskModel.findByIdAndRemove(req.body.checkbox,function(err){
        if(err){console.log(err);}
    })
    res.redirect("/");
})
app.post("/",function(req,res){
    var newItem=req.body.newTask;
    taskModel.collection.insertOne({task:newItem});
    res.redirect("/");
})

app.listen(3000,function(){
    console.log("Server is live at port 3000");
})