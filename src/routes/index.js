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
  // const { data } = await axios.get(`https://api.crossref.org/works/${ doi }`);
  // const { message } = data;
  // console.log(message.title);
  
  // return message.title;
  try {
    const { data } = await axios.get(`https://api.crossref.org/works/${ doi }`);
    const { publisher, author, title, published, abstract, link, URL } = data.message;
    const value = 3.76
    const json = {
      status: 'OK',
      ID: doi,
      DOI: 3.76,
      publisher: await requestPublisher(publisher.toLowerCase(), doi),
      autores: (author.length > 0 ) ? value : 0,
      titulo: (title.toString() !== "") ? value : 0,
      anio: (published['date-parts'].toString() !== "") ? value : 0,
      resumen: ( abstract !== "" ) ? value : 0,
      URL: ( URL !== "" ) ? value : 0,
      URI: (link.length > 0 ) ? value : 0,
      versions: (link.length > 0 ) ? value : 0
    }

    const values = Object.values(json);
    json.total = values.filter(x => x==value).length
    return (json);
  } catch (error) {
    return ({
      status: 'Error',
      ID: doi,
      error
    });
  } 
}

const requestPublisher = async ( publisher, doi ) => {
  switch (true) {
    case publisher.includes('ieee'):
      // const d = await getIEEE(doi);
      // console.log(d);
      // return d;
      try {
        const key = '52et3s479vwknzu2acuemvh6';
        const {data} = await axios.get(`http://ieeexploreapi.ieee.org/api/v1/search/articles?apikey=${ key }&format=json&max_records=25&start_record=1&sort_order=asc&sort_field=article_number&doi=${ doi }`);
        const { articles } = data;
        return articles[0].access_type;
      } catch (error) {
        return 'errir';
      }

      

    case publisher.includes('elsevier'):
    
      return 'Elsevier';
  
    case publisher.includes('springer'):
  
      return 'Springer';
  
    default:
      return 'Default';
  }
}


const getIEEE = async ( doi ) => {
  
  const key = '52et3s479vwknzu2acuemvh6';

  const { articles } = await axios.get(`http://ieeexploreapi.ieee.org/api/v1/search/articles?apikey=${ key }&format=json&max_records=25&start_record=1&sort_order=asc&sort_field=article_number&doi=${doi}`);
  return articles[0];

}

module.exports = router;
