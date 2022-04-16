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
const csvtojson = require('csvtojson');


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
  
  const doisJSON = await getJson('./docs/dois.csv');
  let arrayDatas = [];
  for (i = 0; i < doisJSON.length; i++){
    const {DOI} = doisJSON[i];
    const information = await getInfo(DOI);
    arrayDatas.push(information);
  }
  
  res.json(arrayDatas);
   
});

const getJson = async (rutaCSV) => {
  const resJson = await csvtojson().fromFile(rutaCSV);
  // const jsonArray =  await resJson.json();
  return resJson;
}

const getInfo = async (doi) => {
  const { data } = await axios.get(`https://api.crossref.org/works/${ doi }`);
  // const { message } = data;
  // console.log(message.title);
  
  // return message.title;
  try {
    const { data } = await axios.get(`https://api.crossref.org/works/${ doi }`);
    const { message } = data;
    const json = {
      status: 'OK',
      titulo: message.title,
      autores: message.author
    }
    return (json);
  } catch (error) {
    return ({
      status: 'Error',
      error
    });
  } 
}


module.exports = router;
