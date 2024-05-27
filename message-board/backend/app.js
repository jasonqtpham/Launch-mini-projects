const express=require('express');
const app=express();
const port=5000;
app.use(express.json());

const cors = require('cors')
app.use(cors())
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// use middleware to parse json request bodies
app.use(express.json());


