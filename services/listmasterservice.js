const config = require('../util/configuration.json');
var request = require("request");
var asyncrequest = require("async-request");
const axios = require('axios');
const moment = require('moment');
const logger = require('../helpers/errorlog');
const Razorpay = require("razorpay");

module.exports = class ListMasterService {

  async GetCompaniesforlist(environment,query) {  
    let url ='list/getsampletest';
    const optionurl = config.baseUrl + url;   
    let myvvalue = await this.requestinfo(optionurl,environment,query);
    return myvvalue.data;
  }

  async GetListStage(item) {    
    let myvvalue = await this.requestwithparam(item);    
    return myvvalue;
  }

  setTodoList(result) {
    console.log("my reuslt is ", result);
    for (const [idx, url] of result.controls()) {
      const todo = masgterlist.prototype.getDefaulBillingStatus(config.baseUrl);
      // const todo = await masgterlist.prototype.getContractByGroupIds()
      if (!todo) {
        throw new Error(`HTTP error! status: ${todo.status}`);
      } else {
        console.log(`Received Todo ${idx + 1}:`, todo);
      }

    }

    console.log('Finished!');
  }

  async requestinfo(optionurl,env,query) {
    const url = `list/getsampletest`;
    const response = await axios.get(config.baseUrl + url, {
      headers: {
        'Authorization': `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55SWQiOiI1ZjQ4OTkwNjVhMjc5NzA2YjBjZTgyMTEiLCJjb21wYW55TmFtZSI6IkNvb2xlciIsImlzQWRtaW4iOiIxNTEiLCJ1c2VyVHlwZSI6NCwiaXNTdXBlckFkbWluIjowLCJ1c2VySWQiOiI1ZjQ4OTkxYTVhMjc5NzA2YjBjZTgzNzQiLCJ1c2VyTmFtZSI6IkNvb2xlciIsImlhdCI6MTU5OTg0MDkzOX0.y9UCSb4PUsKtaeuNTHhzCMU8rWDFT2hYySJvIh91jr4`,
        environment: env,
        
      },
      data:query
    });
    if (response) {    
      // let obj = {
      //   controlpanelid: 41
      // }      
      console.log("<--------Fetched List of Companies------->")
      return { status: 200, data: response.data };
    } else {
      console.log("error while fetching the companies list", response);
      return { status: 500, error: response };
    }

  }

  async requestwithparam(item) {
    try {
      
      //console.log("Query is ", query);
      let url = optionurl + `?companyId=${query.companyId}&currency=${query.currency}&startDate=${query.startDate}&endDate=${query.endDate}&contractId=${query.contractId}&customerId=${query.customerId}&contractName=${query.contractName}&customerMobile=${query.customerMobile}&milestonestatusID=${query.milestonestatusID}&contactObjId=${query.contactObjId}`;
      //const url = optionurl + `?companyId=${query.companyId}&startDate=${query.startDate}&endDate=${query.endDate}`;     
     console.log(`companyid: ${query.companyId} , url is :${url}`);
      const response = await axios.get(url, {
        headers: {
          'Authorization': `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55SWQiOiI1ZjQ4OTkwNjVhMjc5NzA2YjBjZTgyMTEiLCJjb21wYW55TmFtZSI6IkNvb2xlciIsImlzQWRtaW4iOiIxNTEiLCJ1c2VyVHlwZSI6NCwiaXNTdXBlckFkbWluIjowLCJ1c2VySWQiOiI1ZjQ4OTkxYTVhMjc5NzA2YjBjZTgzNzQiLCJ1c2VyTmFtZSI6IkNvb2xlciIsImlhdCI6MTU5OTg0MDkzOX0.y9UCSb4PUsKtaeuNTHhzCMU8rWDFT2hYySJvIh91jr4`,
          environment:config.environment
        }
      });
      if (response) {
       
        let insertarray = [];
        let listdata = response.data.data.contract_data.billingdata;
        if (listdata.length > 0) {
          console.log("<--------Fetched list of records from biling rules table------->");
          listdata.forEach(element => {           
            let itemArray = [];
            itemArray.push(element);
            let item = {
              typeName: 'Invoice',
              companyId: element.ContractInformation.ReceiverDetails.companyID,
              Value: itemArray,
              Status: 'not processed',
              CreatedBy: 1,
              isActive: 1,
              environment: config.environment,
              id: element._id
            }
            insertarray.push(item);
          });       
          const insertresponse = await axios.post(config.baseUrl + 'list/create', insertarray, {
            headers: {
              'Authorization': `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55SWQiOiI1ZjQ4OTkwNjVhMjc5NzA2YjBjZTgyMTEiLCJjb21wYW55TmFtZSI6IkNvb2xlciIsImlzQWRtaW4iOiIxNTEiLCJ1c2VyVHlwZSI6NCwiaXNTdXBlckFkbWluIjowLCJ1c2VySWQiOiI1ZjQ4OTkxYTVhMjc5NzA2YjBjZTgzNzQiLCJ1c2VyTmFtZSI6IkNvb2xlciIsImlhdCI6MTU5OTg0MDkzOX0.y9UCSb4PUsKtaeuNTHhzCMU8rWDFT2hYySJvIh91jr4`,
              environment: 'Live'
            }
          })
          if (insertresponse) {
            console.log("<--------Inserted into list master table for companies which are configured onlinepayment------->")
            return { status: 200, data: response.data };
          }
          else {
            return { status: 200, error: error };
          }
        } else {
          console.log("<--------No record found to process------->");          
          return { status: 200, data: "No record found to process" }
        }

      }
      else {
        return { status: 500, error: "some error occoured" };

      }
    } catch (error) {
      return { status: 500, error: error };
    }

  }

  async OnlinePaymentIntegrationCompanies(query) {
    let url = `integrations/getAdmintegrationById`;
    if (query.id) url = `${url}?id=${query.id}`;
    if (query.controlpanelid) url = `${url}?controlpanelid=${query.controlpanelid}`;
    const response = await axios.get(config.baseUrl + url, {
      headers: {
        'Authorization': `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55SWQiOiI1ZjQ4OTkwNjVhMjc5NzA2YjBjZTgyMTEiLCJjb21wYW55TmFtZSI6IkNvb2xlciIsImlzQWRtaW4iOiIxNTEiLCJ1c2VyVHlwZSI6NCwiaXNTdXBlckFkbWluIjowLCJ1c2VySWQiOiI1ZjQ4OTkxYTVhMjc5NzA2YjBjZTgzNzQiLCJ1c2VyTmFtZSI6IkNvb2xlciIsImlhdCI6MTU5OTg0MDkzOX0.y9UCSb4PUsKtaeuNTHhzCMU8rWDFT2hYySJvIh91jr4`,
        environment: 'Live'
      }
    });
    if (response) {
      console.log("3", response)
      return { status: 200, data: response };
    }
    else {
      return { status: 200, error: error };
    }

  }

  async getListforIntegration(environment) {
    let url = 'list/getinvoicelistforintegration';
    const optionurl = config.baseUrl + url;
    let myvvalue = await axios.get(optionurl, {
      headers: {
        'Authorization': `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55SWQiOiI1ZjQ4OTkwNjVhMjc5NzA2YjBjZTgyMTEiLCJjb21wYW55TmFtZSI6IkNvb2xlciIsImlzQWRtaW4iOiIxNTEiLCJ1c2VyVHlwZSI6NCwiaXNTdXBlckFkbWluIjowLCJ1c2VySWQiOiI1ZjQ4OTkxYTVhMjc5NzA2YjBjZTgzNzQiLCJ1c2VyTmFtZSI6IkNvb2xlciIsImlhdCI6MTU5OTg0MDkzOX0.y9UCSb4PUsKtaeuNTHhzCMU8rWDFT2hYySJvIh91jr4`,
        environment: environment
      }
    });
    return myvvalue.data;
  }

  async GetinvoiceList(item) {

    let APiUrl = `contractmaster/getByBillingId?id=${item.Value[0].transactionID}&uId=${item.Value[0].uniqueID}`;
    console.log(APiUrl);
    let headers = {
      Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55SWQiOiI1ZjQ4OTkwNjVhMjc5NzA2YjBjZTgyMTEiLCJjb21wYW55TmFtZSI6IkNvb2xlciIsImlzQWRtaW4iOiIxNTEiLCJ1c2VyVHlwZSI6NCwiaXNTdXBlckFkbWluIjowLCJ1c2VySWQiOiI1ZjQ4OTkxYTVhMjc5NzA2YjBjZTgzNzQiLCJ1c2VyTmFtZSI6IkNvb2xlciIsImlhdCI6MTU5OTg0MDkzOX0.y9UCSb4PUsKtaeuNTHhzCMU8rWDFT2hYySJvIh91jr4`,
      environment: config.environment
    };
    item.headers = headers;
    item.APiUrl = APiUrl;
    let invoiceintegrationlist = await this.backendrequest(item);
    console.log("invoiceintegrationlist", invoiceintegrationlist.data.data.data);
    // logger.info("Application fetched the info for razer pay" ,JSON.stringify(invoiceintegrationlist.data.data.data));
    if (invoiceintegrationlist) {
      let stageinvdata = invoiceintegrationlist.data.data.data;
      let saveresult = await this.prepareRazorpayinvoicejson(stageinvdata);
      if (saveresult) {
        // const insertdataforinvoice = await InsertInvoiceData();
        // if (insertdataforinvoice) {

        // }
      }
      return invoiceintegrationlist;
    } else {
      return { status: 500, error: "some error occoured" }; s
    }
  }

  async backendrequest(item) {
    try {
      const headers = item.headers;
      const optionurl = config.baseUrl + item.APiUrl;
      const response = await axios.get(optionurl, {
        headers
      });
      if (response) {
        return { status: 200, data: response };
      }
      else {
        return { status: 500, error: "some error occoured" };

      }
    } catch (error) {
      return { status: 500, error: error };
    }
  }

  async backendpostrequest(item) {
    try {
      const headers = item.headers;
      const optionurl = item.APiUrl;
      const response = await axios.post(optionurl, item,{
        headers
      });
      if (response) {
        return { status: 200, data: response };
      }
      else {
        return { status: 500, error: "some error occoured" };

      }
    } catch (error) {
      return { status: 500, error: error };
    }
  }

  async prepareRazorpayinvoicejson(objjson) {
    try {
      Date.prototype.toUnixTime = function () { return this.getTime() / 1000 | 0 };
      Date.time = function () { return new Date().toUnixTime(); }
      if (objjson) {
        let line_items = [];
        const currenyCode = objjson.contract.currenyCode;
        //const billing_item_name = 
        objjson.eventdata.forEach(eventitem => {          
          let lineitem ={
              "name": eventitem.billing_types.name,
              "description": eventitem.billing_types.name,
              "amount": eventitem.sellingprice.$numberDecimal,
              "currency": currenyCode,
              "quantity": 1
          }
          line_items.push(lineitem);
        })
        
        let razorpayJSON ={
          "type": "invoice",
          "description": "Invoice for the month of January 2020",
          "partial_payment": true,          
          "customer": {
            "name": objjson.contract.ContractInformation.ReceiverDetails.contactID.firstName,
            "contact": objjson.contract.ContractInformation.ReceiverDetails.contactID.contacts[0].Mobile,
            "email": objjson.contract.ContractInformation.ReceiverDetails.contactID.contacts[1].Email,
            // "name": "Ramakrihna Ravulapalli",
            // "contact": 9959970575,
            // "email": "ramakrishna.ravulapalli@gmail.com",
            "billing_address": {
              "line1": objjson.contract.ContractInformation.ReceiverDetails.contactID.address,
              "line2": "Hosur Road",
              "zipcode": objjson.contract.ContractInformation.ReceiverDetails.contactID.pincode,
              "city": objjson.contract.ContractInformation.ReceiverDetails.contactID.city,
              "state": objjson.contract.ContractInformation.ReceiverDetails.contactID.state,
              "country": objjson.contract.ContractInformation.ReceiverDetails.contactID.country
              // "state": "Andhra Pradesh",
              // "country": "India"
            },
            "shipping_address": {
              "line1": objjson.contract.ContractInformation.ReceiverDetails.contactID.address,
              "line2": "Hosur Road",
              "zipcode": objjson.contract.ContractInformation.ReceiverDetails.contactID.pincode,
              "city": objjson.contract.ContractInformation.ReceiverDetails.contactID.city,
              "state": objjson.contract.ContractInformation.ReceiverDetails.contactID.state,
              "country": objjson.contract.ContractInformation.ReceiverDetails.contactID.country
            }
          },
          "line_items": line_items,
          "sms_notify": 1,
          "email_notify": 1,
          "expire_by": null,
          'partial_payment':true
        }      
        let payload = {
            environment:config.environment,
            typeName:"invoice",
            companyId:objjson.contract.ContractInformation.ReceiverDetails.companyId,
            invoicetype:"invoice",
            invoiceamount:objjson.billingdata[0].milestoneamountwithouttax.$numberDecimal,
            Generateddate:Date.now(),
            paymentdate:null,
            invoiceurl:null,
            invoiceid:null,
            invoicestatus:"draft",
            requestpayload:razorpayJSON,
            response:null,
            isActive:1
        }
       
        try{        
         
        // let invoicedata = await this.sendrazorpay(razorpayJSON);
        let rpheaders={
          'cache-control': 'no-cache',
     authorization: 'Basic cnpwX3Rlc3RfcHhKcXpLclVXVENWYmk6SEJQVVRMcmk5R2N4ZTNVR2hyc1hRb3hl',
     'content-type': 'application/json'
        }
        let razorpayrespnse = await axios.post('https://api.razorpay.com/v1/invoices', razorpayJSON,{
          headers:rpheaders
        }); 
         if(razorpayrespnse){
            console.log("razorpayrespnse",razorpayrespnse);
         }
        }
        catch (error){
          console.log("razorpay response",error.response.data.error.description);
          return { status: 500, error: error };
        }
       
       
       // console.log("payload",payload);
        // let APiUrl = `list/insertlistinvoice`; //?id=${item.Value[0].transactionID}&uId=${item.Value[0].uniqueID}`;
        // let headers = {
        //   Authorization: config.Authorization,
        //   environment: config.environment
        // };
        // let item = {};
        // item.headers = headers;
        // item.APiUrl = APiUrl;
        // item.payload=payload;
        // let listsave = await this.backendpostrequest(item);
        // if(listsave){
        //   return { status: 200, data: razorpayresponse };
        // }
      } else {
        return { status: 200, data: "no data available to process integration" }
      }

    } catch (error) {
      return { status: 500, error: error };
    }
  }

  sendrazorpay(razorpayJSON){
    var options = { method: 'POST',
  url: 'https://api.razorpay.com/v1/invoices',
  headers: 
   { 
     'cache-control': 'no-cache',
     authorization: 'Basic cnpwX3Rlc3RfcHhKcXpLclVXVENWYmk6SEJQVVRMcmk5R2N4ZTNVR2hyc1hRb3hl',
     'content-type': 'application/json' },
      body: razorpayJSON,
  //  { type: 'invoice',
  //    description: 'Invoice for the month of January 2020',
  //    partial_payment: true,
  //    customer: 
  //     { name: 'Ramakrihna Ravulapalli',
  //       contact: 9959970575,
  //       email: 'ramakrishna.ravulapalli@gmail.com',
  //       billing_address: 
  //        { line1: 'teest1234567890',
  //          line2: 'Hosur Road',
  //          zipcode: '',
  //          city: '',
  //          state: 'Andhra Pradesh',
  //          country: 'India' },
  //       shipping_address: 
  //        { line1: 'test21234567890',
  //          line2: 'Hosur Road',
  //          zipcode: '',
  //          city: '',
  //          state: 'Andhra Pradesh',
  //          country: '' } },
  //    line_items: 
  //     [ { name: 'Recurring Price',
  //         description: 'Recurring Price',
  //         amount: '402500',
  //         currency: 'INR',
  //         quantity: 1 } ],
  //    sms_notify: 1,
  //    email_notify: 1,
  //    expire_by: null },
   json: true
 };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  return {status:200,data:body};
});
  }

  async GetOnlinePaymentCredentials(query,companyId,env){
    try{
      let url = `integrations/getAdmintegrationById`;
      if (query.id) url = `${url}?id=${query.id}`;
      if (query.controlpanelid) url = `${url}?controlpanelid=${query.controlpanelid}`;
      const headers = {
        'Authorization': `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55SWQiOiI1ZjQ4OTkwNjVhMjc5NzA2YjBjZTgyMTEiLCJjb21wYW55TmFtZSI6IkNvb2xlciIsImlzQWRtaW4iOiIxNTEiLCJ1c2VyVHlwZSI6NCwiaXNTdXBlckFkbWluIjowLCJ1c2VySWQiOiI1ZjQ4OTkxYTVhMjc5NzA2YjBjZTgzNzQiLCJ1c2VyTmFtZSI6IkNvb2xlciIsImlhdCI6MTU5OTg0MDkzOX0.y9UCSb4PUsKtaeuNTHhzCMU8rWDFT2hYySJvIh91jr4`,
        environment: env,
        companyId:companyId.companyId,
        source:"noti"
      }
      const response = await axios.get(config.baseUrl + url, {
        headers: headers
      });
      if (response) {
       // console.log("3", response)
      // this.calculateData(response.data.data['adm_integration'], response.data.data['integration']);
      response.data.data['adm_integration'].map((m)=>{
        response.data.data['integration'].forEach(n => {
          if(m._id == n.admIntegrationId){
            m.connected = n;
            return m;
          }
        });
      })
      return { status: 200, data: response.data.data['adm_integration'] };
      }
      else {
        return { status: 200, error: error };
      }
    }
    catch(error){
      return { status: 500, error: error };
    }
  }

 async createlistmaster(insertarray){
    const insertresponse = await axios.post(config.baseUrl + 'list/StagingDataCreate', insertarray, {
      headers: {
        'Authorization': `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55SWQiOiI1ZjQ4OTkwNjVhMjc5NzA2YjBjZTgyMTEiLCJjb21wYW55TmFtZSI6IkNvb2xlciIsImlzQWRtaW4iOiIxNTEiLCJ1c2VyVHlwZSI6NCwiaXNTdXBlckFkbWluIjowLCJ1c2VySWQiOiI1ZjQ4OTkxYTVhMjc5NzA2YjBjZTgzNzQiLCJ1c2VyTmFtZSI6IkNvb2xlciIsImlhdCI6MTU5OTg0MDkzOX0.y9UCSb4PUsKtaeuNTHhzCMU8rWDFT2hYySJvIh91jr4`,
        environment: 'Live'
      }
    })
    if (insertresponse) {
      //console.log("<--------Inserted into list master table for companies which are configured onlinepayment------->")
      return { status: 200, data: insertresponse.data };
    }
    else {
      return { status: 200, error: error };
    }
  }
 async fetchlistrecords(query,optionurl){
   let env = query.environment;
    let url = optionurl + `?companyId=${query.companyId}&currency=${query.currency}&startDate=${query.startDate}&endDate=${query.endDate}&contractId=${query.contractId}&customerId=${query.customerId}&contractName=${query.contractName}&customerMobile=${query.customerMobile}&milestonestatusID=${query.milestonestatusID}&contactObjId=${query.contactObjId}`;
  //  console.log("url",url);
    const response = await axios.get(url, {
      headers: {
        'Authorization': `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55SWQiOiI1ZjQ4OTkwNjVhMjc5NzA2YjBjZTgyMTEiLCJjb21wYW55TmFtZSI6IkNvb2xlciIsImlzQWRtaW4iOiIxNTEiLCJ1c2VyVHlwZSI6NCwiaXNTdXBlckFkbWluIjowLCJ1c2VySWQiOiI1ZjQ4OTkxYTVhMjc5NzA2YjBjZTgzNzQiLCJ1c2VyTmFtZSI6IkNvb2xlciIsImlhdCI6MTU5OTg0MDkzOX0.y9UCSb4PUsKtaeuNTHhzCMU8rWDFT2hYySJvIh91jr4`,
        environment:env
      }
    });
    if (response) {
      return { status: 200, data:response.data}
    }
  }

  async fetchstagerecords(item){
    let env = item.environment;
    let optionurl = `list/getliststagerecords`
     let url = optionurl + `?companyId=${item.companyId}`;
   //  console.log("url",url);
     const response = await axios.get(config.baseUrl + url, {
       headers: {
         'Authorization': `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55SWQiOiI1ZjQ4OTkwNjVhMjc5NzA2YjBjZTgyMTEiLCJjb21wYW55TmFtZSI6IkNvb2xlciIsImlzQWRtaW4iOiIxNTEiLCJ1c2VyVHlwZSI6NCwiaXNTdXBlckFkbWluIjowLCJ1c2VySWQiOiI1ZjQ4OTkxYTVhMjc5NzA2YjBjZTgzNzQiLCJ1c2VyTmFtZSI6IkNvb2xlciIsImlhdCI6MTU5OTg0MDkzOX0.y9UCSb4PUsKtaeuNTHhzCMU8rWDFT2hYySJvIh91jr4`,
         environment:env
       }
     });
     if (response) {
       return { status: 200, data:response.data}
     }
   }

  async GetAPICredentials(integrationarray){
    let url = `integrations/getIntegrationById/${integrationarray.integrationid}`;
    const headers = {
      'Authorization': `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55SWQiOiI1ZjQ4OTkwNjVhMjc5NzA2YjBjZTgyMTEiLCJjb21wYW55TmFtZSI6IkNvb2xlciIsImlzQWRtaW4iOiIxNTEiLCJ1c2VyVHlwZSI6NCwiaXNTdXBlckFkbWluIjowLCJ1c2VySWQiOiI1ZjQ4OTkxYTVhMjc5NzA2YjBjZTgzNzQiLCJ1c2VyTmFtZSI6IkNvb2xlciIsImlhdCI6MTU5OTg0MDkzOX0.y9UCSb4PUsKtaeuNTHhzCMU8rWDFT2hYySJvIh91jr4`,
      environment: integrationarray.environment,
      companyId:integrationarray.companyId,
      source:"noti"
    }
    const response = await axios.get(config.baseUrl + url, {
      headers: headers
    });
    if (response) {
      console.log(response);
      return { status: 200, data:response.data}
    }
  }
  async sendtopaymentgateway(payload,APIcred,stagerecordid){
    let headers = {
        Authorization: config.Authorization,
        environment: config.environment
      };
    const item ={};
    item.headers=headers;
    item.payload=payload;
    item.APiUrl=`${config.baseUrl}list/sendinvoiceinfotovendor`;
    item.cred=APIcred;
    item.stagerecordid=stagerecordid;
    const payamentresponse = await this.backendpostrequest(item);
    if(payamentresponse){
      console.log("payamentresponse",payamentresponse);
      return {status: 200, data:payamentresponse}

    }
  }
}
