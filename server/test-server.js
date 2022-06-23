const express = require('express');
const path = require('path');
// const mongoose = require('mongoose'); 
const cors = require('cors');
const dotenv = require('dotenv').config(); //import .env variables

const PORT = 5000;
const app = express();

// mongoose.connect(process.env.MONGOOSE_URL, (err, db)=> {
//   if(!err){
//     console.log('connected to mongoose');
//   } else {
//     console.log(err);
//   }
// })


//parse body request
 app.use(express.json());
 app.use(express.urlencoded({ extended: true }));
 app.use(cors());


//if in production mode, statically serve everything in the build folder on the route '/dist'
// if (process.env.NODE_ENV == 'production'){

  app.use('/dist', express.static(path.join(__dirname, '../dist')));

// serve index.html on the route '/'
  app.get('/*', (req, res) => {
    return res.status(200).sendFile(path.resolve(__dirname, '../index.html'));
});
// }

app.post('/connect', 
 (req, res) => {
     //grab email and password
     const { ipaddress, port } = req.body;
     if (ipaddress){
        res.locals.address = `${ipaddress}:${port}`
        return res.status(200).json({ipaddress, port});
     } else {
         return res.status(403).json({ connected : false});
     }
 }
)



app.post('/login', 
 (req, res) => {
     //grab email and password
     const { email, password } = req.body;
     if (email === "asdf" && password === "asdf"){
        return res.status(200).json({ id: 2, firstName: 'asdf', lastName: 'asdf', age: '3', email:'bs'});
     } else {
         return res.status(403).json({isAuthenticated: false});
     }
 }
)

app.post('/journey/find', 
 (req, res) => {
     //grab email and password
     const { origin, destination, date } = req.body;
     posts = [{journeyid: 123123, origin:'ny', destination:'bali', date:'2022-05-17', creator: {id: 1, firstName: 'A'}, distance:'2000km', cost:'$5000'}]
     if (origin && destination && date){
        return res.status(200).json(posts);
     } else {
         return res.status(403).json({err: 'Could not find'});
     }
 }
)


app.post('/journey/create', 
 (req, res) => {
     //grab email and password
     const { origin, destination, date, driver, user_id } = req.body;
     //array to find all entries with the same origin, desitination and date
     posts = [{journey_id: 123123, origin:'ny', destination:'bali', date:'2022-05-17', creator: {user_id: 1, firstName: 'A'}, distance:'2000km', cost:'$5000'}]
     posts.push({journey_id: 123124, origin:'ny', destination:'bali', date:'2022-05-17', creator: {user_id: 2, firstName: 'B'}, distance:'2000km', cost:'$5000'})
     if (origin && destination && date){
        return res.status(200).json(posts);
     } else {
         return res.status(403).json({err: 'Could not find'});
     }
 }
)







// catch-all route handler for any requests to an unknown route
app.use((req, res) => res.status(404).send('Error: Page not found'));

/**
 * express error handler
 * @see https://expressjs.com/en/guide/error-handling.html#writing-error-handlers
 */

app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});



app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});

module.exports = app;