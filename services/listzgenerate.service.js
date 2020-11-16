var express = require('express');
var router = express.Router();
var request = require("request");
var moment = require('moment');
const axios = require('axios');
var asyncLoop = require('node-async-loop');
const config = require('../util/configuration.json');
//module.exports = class ListGenerateService {
module.exports.getCompanylist = function (list, calback) {
  //  `contractmaster/getInvoice?companyId=${query.companyId}&currency=${query.currency}&startDate=${query.startDate}&endDate=${query.endDate}&contractId=${query.contractId}&customerId=${query.customerId}&contractName=${query.contractName}&customerMobile=${query.customerMobile}&milestonestatusID=${query.milestonestatusID}&contactObjId=${query.contactObjId}`
  const url = `list/getsampletest`;
  axios.get(config.baseUrl + url)
    .then(response => {
      // console.log("res   ::::::::::::",response);
      return { status: true, data: response };
    })
    .catch(error => {
      console.log(error);
      return { status: false, data: error };
    });
};

module.exports.newmethod = function () {
  const url = `list/getsampletest`;
  var options = {
    method: 'GET',
    url: config.baseUrl + url,
    headers: { 'cache-control': 'no-cache' }
  };
  axios.get(config.baseUrl + url)
    .then(response => {
      InsertListStage(response);      
    })
    .catch(error => {
      console.log(error);
    });

}


const test = async _ => {
  try {
    const one = await getOne(false)
  } catch (error) {
    console.log(error) // Failure!
  }

  try {
    const two = await getTwo(false)
  } catch (error) {
    console.log(error) // Failure!
  }

  try {
    const three = await getThree(false)
  } catch (error) {
    console.log(error) // Failure!
  }
}
// const urls = [
//   'https://jsonplaceholder.typicode.com/todos/1',
//   'https://jsonplaceholder.typicode.com/todos/2',
//   'https://jsonplaceholder.typicode.com/todos/3'
// ];

// async function getTodos() {
//   for (const [idx, url] of urls.entries()) {
//     const todo = await fetch(url);
//     console.log(`Received Todo ${idx+1}:`, todo);
//   }

//   console.log('Finished!');
// }

// getTodos();


// module.exports = router;
//}

async function InsertListStage(urls) {
  for (const [idx, url] of urls.entries()) {
    const todo = await listmake.getCompanylist();
    console.log(`Received Todo ${idx + 1}:`, todo);
  }

  console.log('Finished!');
}
async function insert(item) {

}