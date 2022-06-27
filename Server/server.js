const express = require("express")

const app = express();

//when we get a browser GET request
app.get("/", function(req, res){
    res.sendFile("/workspace/Website/index.html")
})

app.listen(3000, function(){
    console.log("server started")
});