// import glob from "glob"
// import fs from 'fs'

const glob = require("glob");
const fs = require("fs");
const express = require('express');
const router = express.Router();
const axios = require('axios').default;


const pdf = require('pdf-extraction');
PDFParser = require("pdf2json");
const csv = require('csv-parser');


// router.get('/', (req, res) => {
//   res.render('index', { title: 'First Web Node' });
// });

// router.get('/contact', (req, res) => {
//   res.render('contact', { title: 'Contact Page' });
// });

router.get('/pdf', async(req, res) => {
  const files = glob.sync('./docs/*.pdf')
  let arrays = [];
  for (let index = 0; index < files.length; index++) {
    const element = files[index];
    const buff = fs.readFileSync(element)
    const { metadata } = await pdf(buff)
    arrays.push(metadata._metadata);
    // if (metadata.includes('doi')){
    // }

  }
  res.json({
    status: files,
    tamanio: files.length,
    arrays: arrays,
  })
})


router.get('/', async (req, res) => {
  const doi = '10.1145/3077286.3077565';
  // const dois = await getDois('./docs/dois.csv');
  // console.log('prueba');
  
  try {
    const {data} = await axios.get(`https://api.crossref.org/works/${ doi }`);
    const json = {
      titulo: data.message.title,
      autores: data.message.author
    }
    res.json({
      status: 200,
      doi: json
    })
  } catch (error) {
    res.json({
      status: 100,
      doi: error
    })
  }
 
});

const getDois = (ruta) => {
  let dois = [];
  fs.createReadStream(ruta)
    .pipe(csv())
    .on('data', ({DOI}) => {
      dois.push(DOI);
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
      console.log(dois)
      return dois;
    });  
}



module.exports = router;
