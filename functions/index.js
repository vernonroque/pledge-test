/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// my code
const express = require("express");
const functions = require("firebase-functions");
require("dotenv").config();
// const PORT = process.env.PORT || 4001;
// **this will cause an error with cloud functions
const cors = require("cors");
const axios = require("axios");
const baseURL = "https://api.pledge.to/v1/organizations";
const myHeader = {
  "Authorization": `Bearer ${process.env.API_KEY}`,
};

// Instantiate the app here
const app = express();
app.use(cors({origin: true}));

// Use static server to serve the Express Yourself Website
// app.use(express.static('public'));

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

app.get("/", (req, res) => {
  console.log("Hello World");
  res.status(200).send("baus");
});

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
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
    console.log(data);
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
