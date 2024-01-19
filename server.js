const express=require("express");
const bodyParser=require("body-parser");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const app=express();

require("dotenv").config();

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",(req,res)=>{
    const sendData={location:"Location",
                    country:"Country",
                    temp:"Temp",
                    disc:"Description",
                    feel:"Feel-like",
                    humidity:"Humidity",
                    speed:"Speed"};
    res.render("index",{sendData:sendData});
})

app.post("/",async(req,res)=>{
    let location= await req.body.city;
    const url=`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.APIKEY}&units=metric`;
    const response=await fetch(url);
    const weatherData= await response.json();
    const temp=Math.floor(weatherData.main.temp);
    const disc=weatherData.weather[0].description;
    const sendData={};
    sendData.temp=temp;
    sendData.disc=disc;
    sendData.location=location;
    sendData.feel=weatherData.main.feels_like;
    sendData.humidity=weatherData.main.humidity;
    sendData.speed=weatherData.wind.speed;
    sendData.country=weatherData.sys.country;
    res.render("index",{sendData:sendData});
})

app.listen(3000,()=>{
    console.log("Server is running....");
})