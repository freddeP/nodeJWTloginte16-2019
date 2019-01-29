const express = require("express");
const bodyParser = require("body-parser");

//bibliotek för lösenordskryptering
const bcrypt = require("bcryptjs");

//initierar applikationen åt oss med hjälp av express
const app = express();

//Låter oss enkelt läsa in form-data som skickas från klienten
app.use(bodyParser.urlencoded({ extended: false }));


//pasword = 12345; // bara för minnet :)
var user = {email:"email@email.se", password: "$2a$13$3DIV9wgVVFpoPGGlQgb7GelSqEJICfEKiQniGH7QMMTfW.T2N0Qpq"};


app.get("/",function(req,res){res.send("Login project");});

app.get("/register",function(req,res){res.sendFile(__dirname+"/register.html");});

app.post("/register",function(req,res){

    // Generera slumpmässigt salt innan kryptering
    bcrypt.genSalt(13, function(err,salt){
       // kryptera/hasha vårt lösenord.
        bcrypt.hash(req.body.password,salt,function(err, hash){

            // uppdater vår statiska user.
            user = {email:req.body.email, password:hash};
            res.send(user);

        });
    });  
});

app.get("/login",function(req,res){res.sendFile(__dirname+"/login.html");});
app.post("/login",function(req,res){

    // Leta efter användare
    if(user.email === req.body.email)
    {
       // Nu vet vi att en användare finns med email
       //kolla nu lösenord.......!!!!!
        bcrypt.compare(req.body.password,user.password,function(err,success){

            if(success)     {res.send("logged in");}
            else            {res.send("login error");}
       });
    }
    else{
        res.send("login error");
    } 
});  // End post /login





// Lyssna på port 1337
app.listen(1337,function(){
    console.log("app started port 1337");
});