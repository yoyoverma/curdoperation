const express = require('express');
const app = express();
const dotenv = require("dotenv");
var bodyParser = require("body-parser");
dotenv.config();

app.set("view engine","ejs");

const connection = require("./config/db");

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get("/",(req,res)=>{
    res.redirect("create.html")
});
//delete opertaion
app.get("/delete-data",(req,res) => {
    console.log("Query parameter: ", req.query.id);
    const deleteQuery = "DELETE FROM product WHERE id= ?";

    connection.query(deleteQuery, [req.query.id],(err,rows)=>{
        if(err){
            console.log(err);
        }else{
            res.redirect("/data");
        }
    });
});

//update operation
app.get("/update-data",(req,res)=>{
     connection.query("select * from product where id= ?", [req.query.id], (err, eachRow) => {
        if(err){
            console.log(err);
        }
        else{
            result = JSON.parse(JSON.stringify(eachRow[0]));
            console.log(result);
            res.render("edit.ejs",{result});
        }
     });
});

app.post("/final-update",(req,res) =>{
    const id= req.body.hidden_id;
    const productname = req.body.productname;
    const categoryname = req.body.categoryname;
    console.log("id....",id);
        const updateQuery="update product set productname= ?, categoryname=? where id=?";
    try {
        connection.query(updateQuery,[productname,categoryname,id],(err,rows)=>{
            if(err){
                console.log(err);
            }else{
                res.redirect("/data");
            }
        });
    } catch (err) {
        console.log(err);
    }
});

//read operation
app.get("/data", (req,res)=>{
    connection.query("select * from product",(err,rows)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("read.ejs",{rows});
        }
    });
});
app.get("/data", )
//create operation
app.post("/create",(req,res) =>{
    console.log(req.body);

    const productname = req.body.productname;
    const categoryname = req.body.categoryname;
    try {
        connection.query("INSERT into product(productname,categoryname) values(?,?)",
        [productname,categoryname],
        (err,rows)=>{
            if(err){
                console.log(err);
            }else{
                res.redirect("/data");
            }
        });
    } catch (err) {
        console.log(err);
    }
});

app.listen(process.env.PORT || 4000, (error) =>{
    if (error) throw error;
    console.log(`server running on ${process.env.PORT}`)
});