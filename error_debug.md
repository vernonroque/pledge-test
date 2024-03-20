This is the code from my frontend. It is in a directory called "build". The file is called index.js:

const form = document.querySelector('.donate-form');
const input = document.querySelector('.search');
const submitBtn = document.querySelectorAll('.submit-button');
const orgContainer = document.querySelector('.org-container');
const searchForm = document.querySelector('.search-form');
const search = document.querySelector('.search');
const prevBtn = document.querySelector('.previous-button');
const nextBtn = document.querySelector('.next-button');
let buttonId ='';
let query = '';
let pgCounter = 0;
const baseURL = 'http://127.0.0.1:5001/pledge-test-aa5d1/us-central1/api'

function renderResults(results){
console.log("The results>>>",results);
results.forEach(item =>{
if(item.name && item.website_url && item.logo_url){
const orgCard = document.createElement('div');
orgCard.classList.add('org-card')
orgCard.innerHTML = `         <h1 class="org-name">${item.name}</h1>
            <div class ="logo-container">
                <a href = ${item.website_url} target="_blank"><img class = "org-logo" src = "${item.logo_url}" alt = logo width="250" height="250" /></a>
            </div>
        `;
orgContainer.appendChild(orgCard)
}
else{
const orgCard = document.createElement('div');
orgCard.classList.add('org-card')
orgCard.innerHTML = `         <h1 class="org-name">${item.name}</h1>
            <div class ="logo-container">
               <p>logo unavailable</p>
            </div>
        `;
orgContainer.appendChild(orgCard)
}

    })

}

function fetchInfo(endpoint){
console.log("Hey Baus");
return fetch(endpoint,{
method:'GET'
},
).then((response)=>{
console.log(response);
return response.json();
}).then((jsonResponse)=>{
//use .childElementCount to check if a parent container has child elements
if(orgContainer.childElementCount > 0){
orgContainer.innerHTML = '';
}
try{
console.log(jsonResponse);
renderResults(jsonResponse.results);
return "good to go!";
}catch(error){
console.log("there is an error>>>",error);
}
});
}

function handleClick(e){
e.preventDefault();
const idNum = e.target.id;
query =''
pgCounter = 1;
// if (buttonId == idNum){
// console.log("same id. exiting");
// return;
// }
buttonId = idNum;
console.log("the id of button is >>>",buttonId);
const endpoint = `${baseURL}/organizations?cause_id=${idNum}`;
fetchInfo(endpoint);
}

const handleSubmit = (e) => {
e.preventDefault();
//console.log('hey baus. final query is>>>',query);
const queryEndpoint = `${baseURL}/searchOrg?q=${query}`;
fetchInfo(queryEndpoint)
setTimeout(()=>{
search.value = '';

    },3000)

}

const handleChange=(e) =>{
query = e.target.value;
buttonId = '';
pgCounter = 1;
//console.log("The searched term is>>>", query);
const queryEndpointInt = `${baseURL}/searchOrg?q=${query}`;
fetchInfo(queryEndpointInt)
}
const handleNext = (e) =>{
pgCounter++;
console.log("the counter is now>>>", pgCounter);
if(!query && !buttonId){
const endpoint = `${baseURL}/next?page=${pgCounter}`;
fetchInfo(endpoint);
}
if(query){
//buttonId='';
const endpoint = `${baseURL}/next?page=${pgCounter}&q=${query}`;
fetchInfo(endpoint);
}
if(buttonId){
//query ='';
console.log("There is a buttonId>>",buttonId);
const endpoint = `${baseURL}/next?page=${pgCounter}&cause_id=${buttonId}`;
fetchInfo(endpoint);
}

}
const handlePrev = (e) => {
//console.log(e);
if(pgCounter ==1){
console.log("number is one");
pgCounter=1;
return;
}
else{
pgCounter--;
console.log("the counter is now>>>", pgCounter);
}

    if(!query && !buttonId){
        const endpoint = `${baseURL}/next?page=${pgCounter}`;
        fetchInfo(endpoint);
    }
    // if(!query && buttonId){
    //     const endpoint = `http://localhost:4001/next?page=${pgCounter}&cause_id=${buttonId}`;
    //     fetchInfo(endpoint);
    // }

    if(query){
        //buttonId='';
        const endpoint = `${baseURL}/next?page=${pgCounter}&q=${query}`;
        fetchInfo(endpoint);
    }
    if(buttonId){
        //query='';
        const endpoint = `${baseURL}/next?page=${pgCounter}&cause_id=${buttonId}`;
        fetchInfo(endpoint);
    }

}

submitBtn.forEach(button => button.addEventListener('click', handleClick));
prevBtn.addEventListener('click', handlePrev);
nextBtn.addEventListener('click',handleNext);
searchForm.addEventListener('submit', handleSubmit);
search.addEventListener('input',handleChange);

---

And here is the code from my backend. It is also called index.js. And it is in my directory called "functions":

---

const express = require("express");
const functions = require("firebase-functions");
require("dotenv").config();
// const PORT = process.env.PORT || 4001;
// this will cause an error with cloud functions
const cors = require("cors");
const axios = require("axios");
const baseURL = "https://api.pledge.to/v1/organizations";
const myHeader = {
"Authorization": `Bearer ${process.env.API_KEY}`,
};

// Instantiate the app here
const app = express();
app.use(cors());

// Use static server to serve the Express Yourself Website
// app.use(express.static('public'));

// app.listen(PORT, () => {
// console.log(`Server is running on port ${PORT}`);
// });

app.get("/", (req, res) => {
console.log("Hello World");
res.status(200).send("baus");
});

app.get("/organizations", async (req, res) => {
console.log("Making API call");
console.log(req.query.cause_id);
try {
// eslint-disable-next-line max-len
const response = await axios.get(baseURL+"?"+`cause_id=${req.query.cause_id}`, {
headers: myHeader,
});
const data = await response.data;
res.status(200).send(data);
// res.json(data);
} catch (error) {
console.error(error);
res.status(500).json({error: "Internal Server Error"});
}
});

app.get("/searchOrg", async (req, res)=> {
console.log("Search query >>>", req.query.q);
try {
const response = await axios.get(baseURL+"?"+`q=${req.query.q}`, {
headers: myHeader,
});
const data = await response.data;
res.status(200).send(data);
} catch (error) {
console.error(error);
res.status(500).json({error: "Internal Server Error"});
}
});

app.get("/next", async (req, res)=>{
// console.log("Im in the next endpoint");
// Using template literals
let queryString = " ";
// eslint-disable-next-line guard-for-in
for (const key in req.query) {
queryString += `${key}=${req.query[key]}&`;
}
// Remove the trailing '&' if necessary
queryString = queryString.slice(0, -1);

try {
const response = await axios.get(baseURL+"?"+`${queryString}`, {
headers: myHeader,
});
const data = await response.data;
res.status(200).send(data);
// res.json(data);
} catch (error) {
console.error(error);
res.status(500).json({error: "Internal Server Error"});
}
});

// Listen command
exports.api = functions.https.onRequest(app);

---

Here is the package.json from functions directory:

---

{
"name": "functions",
"description": "Cloud Functions for Firebase",
"scripts": {
"lint": "eslint .",
"serve": "firebase emulators:start --only functions",
"shell": "firebase functions:shell",
"start": "npm run shell",
"deploy": "firebase deploy --only functions",
"logs": "firebase functions:log"
},
"engines": {
"node": "18"
},
"main": "index.js",
"dependencies": {
"axios": "^1.6.7",
"cors": "^2.8.5",
"dotenv": "^16.4.5",
"firebase-admin": "^11.8.0",
"firebase-functions": "^4.3.1"
},
"devDependencies": {
"eslint": "^8.15.0",
"eslint-config-google": "^0.14.0",
"firebase-functions-test": "^3.1.0"
},
"private": true
}
