const express = require("express");
const CORS = require("cors");
const route = require("./router")
const ChatGPTService = require("./chatGPT_service")

const app = express();

ChatGPTService.initialize("---insert your openAPI key here---")

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use(CORS({
    origin:'http://localhost:3001',
    methods:["PUT","GET", "POST"]
}))

app.use("/ai-completion", route)


const port = 5000;
app.listen(port, ()=>{
    console.log(`server is running on http:\\localhost:${port}`);
})
