const jwt = require("jsonwebtoken");

// skall ligga i miljövariabel
const secret = "asdölfkjöasldfkjasödflkasöjdfklasjödfklasjöfda";


module.exports = function(req,res,next){

    const token = req.cookies["x-token"];
    jwt.verify(token,secret, function(err, token){

            if(err) res.send("invalid token");
            else next();
    });
    console.log("FROM middleware");
 
}