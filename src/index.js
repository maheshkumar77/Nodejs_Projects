import express from 'express';
import { detail } from './util/data.js'; // Importing data correctly
import { cookie } from 'express-validator';
import cookieParser from 'cookie-parser';

const app = express();
const port = process.env.PORT || 3001;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser("heloworld"));

// Route to serve a welcome message
app.get('/', (req, res) => {
    res.cookie("helo","world",{maxAge:60000 , signed:true });
    res.status(200).send("Hi, it's me Mahesh");
});

// Route to get all data
app.get('/api/data', (req, res) => {
    // Logging request body in GET requests is uncommon but useful for debugging
    //console.log(req.header.cookies);
    console.log(req.cookies)
    console.log(req.cookies.value);
    console.log(req.signedCookies);
    if (req.cookies.helo  && req.cookies.helo === 'world'){
    console.log(req.body); 
     return res.json(detail); // Send the data as a JSON response
}
return res.status(401).json("sory dont find");
});

// Route to add new data
app.post('/api/data', (req, res) => {
    const newd = req.body; // Get the new data from the request body

    // Ensure the incoming data is valid
    if (!newd || typeof newd !== 'object' || Array.isArray(newd)) {
        return res.status(400).json({ error: 'Invalid data' });
    }

    // Create a new data entry with a new ID
    const newdata = { id: detail[detail.length - 1].id + 1, ...newd };
    detail.push(newdata); // Add the new data to the array

    // Respond with the newly created data
    return res.status(201).json(newdata);
});

// Route to filter users
app.get('/api/finduser', (req, res) => {
    const { filter, value } = req.query;

    if (filter && value) {
        const validFilters = ["name", "age", "add"];
        if (!validFilters.includes(filter)) {
            return res.status(400).json({ msg: 'Invalid filter field' });
        }

        // Filter based on query parameters
        const filteredData = detail.filter(user => user[filter] && user[filter].toString().toLowerCase().includes(value.toLowerCase()));
        return res.json(filteredData);
    }

    // If filter or value is not provided, return all data
    return res.json(detail);
});
app.get('/api/finduser/:id',(req,res)=>{
    const parsedId = parseInt(req.params.id, 10);
    if(isNaN(parsedId)){
        res.json({msg:"bed request"});
    }
    const fonduser=detail.find((user)=> user.id === parsedId);
    if(!fonduser){
        res.json({msg:"sory we cant find"});
    }
    res.json(fonduser);
})
app.put('/api/finduser/:id',(req,res)=>{
    const newd=req.body;
    const{id}=req.params;
    const parsedId=parseInt(id);
    if(isNaN(parsedId)){
        res.json("sory please input ");
    }
    const index=detail.findIndex((user)=> user.id=== parsedId);
    if (index === -1) {
        return res.status(404).send({ msg: 'User not found' });
      }
    detail[index]={id:parsedId,...newd};
    console.log(detail[index]);
    res.json(detail[index]);s
})
app.patch('/api/finduser/:id',(req,res)=>{
    const newd=req.body;
    const{id}=req.params;
    const parsedId=parseInt(id);
    if(isNaN(parsedId)){
        res.json("sory please input ");
    }
    const index=detail.findIndex((user)=> user.id=== parsedId);
    if (index === -1) {
        return res.status(404).send({ msg: 'User not found' });
      }
    detail[index]={...detail[index],...newd};
    res.json(detail[index]);s
})
app.delete('/api/finduser/:id',(req,res)=>{
    
    const{id}=req.params;
    const parsedId=parseInt(id,10);
    if(isNaN(parsedId)){
        res.json('sory input delate data');
    }
    const index=detail.findIndex((user)=> user.id=== parsedId);
    if(index == -1){
        res.json("sory we cant delate");
    }
    detail.slice(index);
    res.json('delate');
})


// Start the server
app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`);
});
