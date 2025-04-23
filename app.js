const express = require('express')
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const app = express()
const Todo = require("./models/todo")
const port = 3030

const dburl = "mongodb://localhost:27017/tododb"
mongoose.connect(dburl, {
    useNewUrlParser: true, useUnifiedTopology :true
})

app.set("view engine" , "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.get("/", async (req,res)=>{
    const result = await Todo.find({})
    console.log(result)
    res.render("index", {data: result})
})

app.post("/", (req,res)=>{
    const todo = new Todo({
        todo : req.body.todoValue
    })
    todo.save()
    .then(result => {
        res.redirect("/")
    })
})

app.delete("/:id", (req,res)=>{
    Todo.findByIdAndDelete(req.params.id)
    .then(result => {
        console.log(result)
    })
})

app.listen(port, () =>{
    console.log("running on port"+port)
})