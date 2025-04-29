const express = require('express')
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const app = express()
const Todo = require("./models/todo")
const UserInfo = require("./models/user")
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const tokenSecretKey = "gfg_jwt_secret_key"
const tokenHeaderKey = "gfg_token_header_key"
const path = require('path');

dotenv.config();

const dburl = "mongodb://localhost:27017/tododb"
mongoose.connect(dburl)

app.set("view engine" , "ejs")
// app.set("views", "./views")
app.set('views', path.join(__dirname, 'views'));

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.get("/", async (req,res)=>{
    res.render("index", {data: null})
})

app.get("/detail-task/", async (req,res)=>{
    res.render("detailtask", {data: null})
})

app.get("/api/getinfo", async (req,res) =>{
    const token = req.get('Authorization').split(" ")[1];
    if(token !== "null" ){
        console.log("===")
        console.log(tokenSecretKey)
        console.log("===")

        const verified = jwt.verify(token, tokenSecretKey);
        req.user = verified;
        const result = await Todo.find({ user: req.user.userName})
        console.log(result)
        if(!result){
            res.redirect("../page/login.html")
        }else{
            res.send({ result: result,  user: req.user.userName });
        }
    }else{
        return res.json({ message: "chưa có thông tin người dùng đăng nhập"})
    } 
})


app.post("/page/login", async (req,res) => {
    
    const { usernamelogin, passwordlogin} = req.body;
    const result = await UserInfo.findOne({ username: usernamelogin, password: passwordlogin}).exec();
    
    console.log(result)
    if (!result) {
            return res.json({ message: "Tên đăng nhập không tồn tại" });
    }else{

        let userid = result.id
        let name = result.username

        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        let data = {
            userId: userid,
            userName: name
        }
        const token = jwt.sign(data, jwtSecretKey);
        
        return res.json({ token: token });

    }
})

app.post("/register", (req,res) =>{
    // const user = new UserInfo ({
    //     username : req.body.username,
    //     password  : req.body.password
    // })
    // user.save()
    // .then(result => {
    //     res.redirect("/../page/detailtask.ejs")
    // })
    res.redirect("../page/register.html")
})
app.post("/register/info", (req,res) =>{
    const user = new UserInfo ({
        username : req.body.username,
        password  : req.body.password
    })
    user.save()
    .then(result => {
        res.redirect("/")
    })
})
app.post("/", async (req,res)=>{
    const token = req.get('Authorization').split(" ")[1];
    if(token !== "null" ){
        const verified = jwt.verify(token, tokenSecretKey);
        req.user = verified;
        console.log(req.user)
        const result = await Todo.find({ user: req.user.userName})
        console.log(result +"okkkkkkkkkkkkkk")
        const todo = new Todo({
            todo : req.body.name,
            user : result[0].user
        })
        await todo.save()
        res.send({message: "success"})
    }else{
        return res.json({ message: "chưa có thông tin người dùng đăng nhập"})
    } 
})
app.post("/add", async (req,res)=>{
    const token = req.get('Authorization').split(" ")[1];
    if(token !== "null" ){
        const verified = jwt.verify(token, tokenSecretKey);
        req.user = verified;
        console.log(req.user)
        const result = await Todo.find({ user: req.user.userName})
        console.log(result +"okkkkkkkkkkkkkk")
        const todo = new Todo({
            todo : req.body.name,
            user : req.user.userName
        })
        await todo.save()
        res.send({message: "success"})
    }else{
        return res.json({ message: "chưa có thông tin người dùng đăng nhập"})
    } 
})


app.get("/logout", (req,res) => {
    req.session.user = ""
    req.session.loggedIn = false
    res.redirect("/")
})

app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id)
    try {
        const todo = await Todo.findByIdAndDelete(id);

        if (!todo) {
            return res.status(404).json({ message: 'Todo không tồn tại' });
        }
        res.status(200).json({ message: 'Todo đã được xóa thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa Todo' });
    }
});

app.get('/details/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id + "abc")
    try {
        const todo = await Todo.findById(id);
        console.log("---")
        console.log(todo)
        console.log("---")
        if (!todo) {
            return res.status(404).json({ message: 'Todo không tồn tại' });
        }else{
            console.log("detal")
            res.redirect("../page/detailtask.html")
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa Todo' });
    }
});

app.listen(process.env.PORT, () =>{
    console.log("running on port"+process.env.PORT)
})