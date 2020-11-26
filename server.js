// BASE SETUP
// =============================================================================
require('dotenv').config();
// call the packages we need
var express    = require('express');
var request = require("request");
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');
const logger = require('./helpers/errorlog');
const config =require('./util/configuration');
const generatelist = require('./controllers/zlist.controller');
const listmake =require('./services/listzgenerate.service');
const masgterlist = require('./controllers/listgenerate.Controller');
const invoicelist = require('./controllers/integration.Controller');
const generatelistcontroller = require('./controllers/generatelist.Controller');



var schedule= require('node-schedule');
var dateFormat = require('dateformat');
app.use(morgan('dev')); 
// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port     = process.env.PORT || 8080; // set our port
process.on('uncaughtException', (err) => {    
    console.log('Caught exception : ', err);
});
// app.use(function (req, res, next) {
// 	next(createError(404));
// });
global.NoErrorInfo =false;
// Add headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,start');
    res.setHeader('Access-Control-Expose-Headers', 'X-Requested-With,content-type,start');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});
app.use(function (err, req, res, next) { 
	if (err.code === 'ENOENT') {
		console.log('File not found!');
		console.log(req.params.filepath);
		console.log(req.url);
		} else {
		console.log("Error:", err)
		res.locals.message = err.message;
		res.locals.error = req.app.get('env') === 'development' ? err : {};
		res.status(err.status || 500);
		res.json({ Response: 2, message: err.message });
		}
});
// create our router
var router = express.Router();
// middleware to use for all requests
router.use(function(req, res, next) {	
	next();
});
var http = require("http");
// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);
// START THE SERVER
// =============================================================================
// app.listen(port);
// console.log('application is running on port ' + port);
function intiApp() {
    app.listen(port, (err) => {
        if (err)
            logger.error(`Unable to lunch the application :: ${err.message}`);
        else {
            logger.info(`Application launch successfully on port ${port}`);
            console.log('application is running on port ' + port);
        }
    })
}
intiApp();

const scheduletime=dateFormat(new Date(), "H") + ":00";
var rule = new schedule.RecurrenceRule();
rule.minute = new schedule.Range(0, 59,2);
let invoicerule = new schedule.RecurrenceRule();
invoicerule.minute= new schedule.Range(0,59,2);

schedule.scheduleJob(rule, function(){ 
    if(global.NoErrorInfo)
    console.log("some error ");
    else
    {   
        // console.log("executed time ", Date.now());
        // console.log("rounded time",Math.floor(Date.now() /1000));
        let ts = Date.now();
        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();
                
        console.log(year + "-" + month + "-" + date + ' ' + hours + ":" + minutes + ":" + seconds);
       
      console.log("<--------List Generation Started------->");
      //masgterlist.prototype.getcompanineslist(config.environment);
      generatelistcontroller.prototype.getcompanineslist(config.environment);
    }
    // getcompanieslist --from timer 
    // getcompanineslist -- from controller
    // CallCompaniesforlistMethod -- from controller in 2 step -- fetching the company details from listmaster table
    // processinvoicelistforcompanies -- from controller after 3 step -- loop each company and fetch the billing details
    //  and inserting in the list stage table
    
});

schedule.scheduleJob(invoicerule, function(){ 
    if(global.NoErrorInfo)
    console.log("some error ");
    else
    {   
       
        let ts = Date.now();
        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();
                
        console.log(year + "-" + month + "-" + date + ' ' + hours + ":" + minutes + ":" + seconds);
        Date.prototype.toUnixTime = function() { return this.getTime()/1000|0 };
        Date.time = function() { return new Date().toUnixTime(); }
    
        // Get the current unix time: 
        console.log("Current Time: " + Date.time())
    
       //invoicelist.prototype.GetListforPayment(config.environment);
    } 
});


 const urls = [
      'https://jsonplaceholder.typicode.com/todos/1',
      'https://jsonplaceholder.typicode.com/todos/2',
      'https://jsonplaceholder.typicode.com/todos/3'
    ];
    
    async function getTodos() {
      for (const [idx, url] of urls.entries()) {
        const todo = await masgterlist.prototype.getDefaulBillingStatus(config.baseUrl);
       // const todo = await masgterlist.prototype.getContractByGroupIds()
        if (!todo) {
            throw new Error(`HTTP error! status: ${todo.status}`);
          } else {
            console.log(`Received Todo ${idx+1}:`, todo);
          }
        
      }
    
      console.log('Finished!');
    }
    
    

