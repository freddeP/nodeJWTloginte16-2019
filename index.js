const express = require("express");
const bodyParser = require("body-parser");
// Lägg till JWT
const jwt = require("jsonwebtoken");
// Lägg till cookieParser
const cookieParser = require("cookie-parser");
const authCheck = require("./authCheck.js");

// Hemlighet som egentligen skall ligga i miljövariabel.
const secret = "asdölfkjöasldfkjasödflkasöjdfklasjödfklasjöfda";



//bibliotek för lösenordskryptering
const bcrypt = require("bcryptjs");

//initierar applikationen åt oss med hjälp av express
const app = express();

//Låter oss enkelt läsa in form-data som skickas från klienten
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

//pasword = 12345; // bara för minnet :)
var user = {id: "y345u", admin:false, email:"email@email.se", password: "$2a$13$3DIV9wgVVFpoPGGlQgb7GelSqEJICfEKiQniGH7QMMTfW.T2N0Qpq"};


app.get("/secretStuff",authCheck, function(req,res){

        res.send(req.cookies["x-token"]);

});

app.get("/",function(req,res){res.send("Login project: "+req.cookies["x-token"]);});

app.get("/register",function(req,res){res.sendFile(__dirname+"/register.html");});

app.post("/register",function(req,res){

    // Generera slumpmässigt salt innan kryptering
    bcrypt.genSalt(13, function(err,salt){
       // kryptera/hasha vårt lösenord.
        bcrypt.hash(req.body.password,salt,function(err, hash){

            // uppdatera vår statiska user.
     
            user.email = req.body.email;
            user.password = hash;
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

            if(success)     {
                // skapa nytt objekt med viss info om user
                const jwtUser = {};
                jwtUser.id =user.id;
                jwtUser.admin = user.admin;

                const token =  jwt.sign(jwtUser, secret, { expiresIn: '60000' });
                res.cookie('x-token',token);
                res.send("logged in check your COOKIES");
            
            
            }
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