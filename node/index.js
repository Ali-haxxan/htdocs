const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const bodyParser = require('body-parser');
const fs = require('fs');
require('dotenv').config()

app.use(bodyParser.urlencoded({ extended: false })); 

router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/public/index.html'));
});

app.post('/add-country', async (req, res) => {
  const countryBody = req.body.country
  try {
    const apiResponse = await fetch(
      'https://restcountries.com/v3.1/name/'+ countryBody
      )
      const apiResponseJson = await apiResponse.json()
      let fileread = fs.readFileSync('country.json','utf-8');
      // console.log(fileread);
      var filelength = fileread.length
      var id = 1
        const countobj = {
          id: id,
          name: apiResponseJson[0].name.official,
          continent: apiResponseJson[0].continents[0],
          languages: Object.values(apiResponseJson[0].languages)
        }
        if(filelength == 0){
          var countries = []
          countries.push(countobj)
          id++;
          // console.log(filelength);
          fs.writeFile('country.json', JSON.stringify(countries), function (err) {
            if (err) {
              // res.send('Entered wrong country!')
              res.sendFile(path.join(__dirname+'/public/error.html'));
            } else {
              // res.send('Country added successfully!')
              res.sendFile(path.join(__dirname+'/public/success.html'));
            }
          });
        }
        else{
          var parsed = JSON.parse(fileread)
          // console.log(parsed)
          parsed.push(countobj)
          fs.writeFileSync('country.json', JSON.stringify(parsed), function (err) {
            if (err) {
              // res.send('Entered wrong country!')
              res.sendFile(path.join(__dirname+'/public/error.html'));
            } else {
              // res.send('Country added successfully!')
              res.sendFile(path.join(__dirname+'/public/success.html'));
            }
          });
        }
        // res.sendFile(path.join(__dirname+'/public/index.html'));
        res.sendFile(path.join(__dirname+'/public/success.html'));
        } catch (err) {
        // console.log(err)
        // res.status(500).send('500 Something went wrong')
        res.sendFile(path.join(__dirname+'/public/error.html'));

        }
});

router.get('/country-list',function(req,res){
let rawdata = fs.readFileSync('country.json','utf-8');
let countriees = JSON.stringify(rawdata);

res.sendFile(path.join(__dirname+'/public/country.html'),countriees);
});

router.get('/send-country-list',function(req,res){
  let rawdata = fs.readFileSync('country.json','utf-8');
  let countriees = JSON.parse(rawdata);
  res.json({ countriees: countriees});
  });

app.use('/', router);

app.listen(process.env.PORT || 3001, () => {
  console.log("Application started and Listening on port http://127.0.0.1:3000");
});
