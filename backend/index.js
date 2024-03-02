const express = require('express');
require('dotenv').config()
const PORT = process.env.PORT || 4001;
const cors = require('cors');
const axios = require('axios');
const baseURL = 'https://api.pledge.to/v1/organizations'
const myHeader = {
    'Authorization': `Bearer ${process.env.API_KEY}`
}

// Instantiate the app here
const app = express(); 
app.use(cors());

// Use static server to serve the Express Yourself Website
//app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req,res) => {
    console.log("Hello World");
    res.status(200).send("baus");
})

app.get('/organizations', async(req,res) => {
    console.log("Making API call");
    console.log(req.query.cause_id)
    try {
        const response = await axios.get(baseURL+'?'+`cause_id=${req.query.cause_id}`,{
            headers:myHeader
        });
        const data = await response.data;
        res.status(200).send(data)
        // res.json(data);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
})

app.get('/searchOrg', async(req, res)=>{

  console.log("Search query >>>", req.query.q);
  try {
    const response = await axios.get(baseURL+'?'+`q=${req.query.q}`,{
        headers:myHeader
    });
    const data = await response.data;
    res.status(200).send(data)
    // res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.get('/next', async(req,res)=>{
  console.log("Im in the next endpoint");
  // Using template literals
  let queryString = '';
  for (const key in req.query) {
    queryString += `${key}=${req.query[key]}&`;
  }
  // Remove the trailing '&' if necessary
  queryString = queryString.slice(0, -1);

  try {
    const response = await axios.get(baseURL+'?'+`${queryString}`,{
        headers:myHeader
    });
    const data = await response.data;
    res.status(200).send(data)
    // res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})
