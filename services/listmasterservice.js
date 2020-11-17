const config =require('../util/configuration.json');
var request = require("request");
var asyncrequest =require("async-request");
const axios = require('axios');
const moment = require('moment');

module.exports = class ListMasterService {
    
     async GetCompaniesforlist(environment) {
             // let companyID =environment;
        let url='list/getsampletest';
        const optionurl = config.baseUrl + url;
        // var options = { method: 'GET',
        //   url: optionurl,
        //   headers: 
        //    { 
        //      'cache-control': 'no-cache',
        //      authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55SWQiOiI1ZjQ4OTkwNjVhMjc5NzA2YjBjZTgyMTEiLCJjb21wYW55TmFtZSI6IkNvb2xlciIsImlzQWRtaW4iOiIxNTEiLCJ1c2VyVHlwZSI6NCwiaXNTdXBlckFkbWluIjowLCJ1c2VySWQiOiI1ZjQ4OTkxYTVhMjc5NzA2YjBjZTgzNzQiLCJ1c2VyTmFtZSI6IkNvb2xlciIsImlhdCI6MTU5OTg0MDkzOX0.y9UCSb4PUsKtaeuNTHhzCMU8rWDFT2hYySJvIh91jr4',
        //      environment: environment } };
             let myvvalue = await this.requestinfo(optionurl);          
             return myvvalue.data;             
    }  

    async GetListStage(item){
        // let url='list/getsampletest';
        // const optionurl = config.baseUrl + url;
        // var options = { method: 'GET',
        //   url: optionurl,
        //   headers: 
        //    { 
        //      'cache-control': 'no-cache',
        //      authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55SWQiOiI1ZjQ4OTkwNjVhMjc5NzA2YjBjZTgyMTEiLCJjb21wYW55TmFtZSI6IkNvb2xlciIsImlzQWRtaW4iOiIxNTEiLCJ1c2VyVHlwZSI6NCwiaXNTdXBlckFkbWluIjowLCJ1c2VySWQiOiI1ZjQ4OTkxYTVhMjc5NzA2YjBjZTgzNzQiLCJ1c2VyTmFtZSI6IkNvb2xlciIsImlhdCI6MTU5OTg0MDkzOX0.y9UCSb4PUsKtaeuNTHhzCMU8rWDFT2hYySJvIh91jr4',
        //      environment: item.environment } };
             let myvvalue = await this.requestwithparam(item);
           //  console.log("myvalue print ", myvvalue);
             return myvvalue;
    }

     setTodoList(result) {
        console.log("my reuslt is " ,result);
        for (const [idx, url] of result.controls()) {
          const todo =  masgterlist.prototype.getDefaulBillingStatus(config.baseUrl);
         // const todo = await masgterlist.prototype.getContractByGroupIds()
          if (!todo) {
              throw new Error(`HTTP error! status: ${todo.status}`);
            } else {
              console.log(`Received Todo ${idx+1}:`, todo);
            }
          
        }
      
        console.log('Finished!');
      }  

   async requestinfo(optionurl){       
        const url = `list/getsampletest`;
        const response=await axios.get(config.baseUrl+url,{
          headers: {
            'Authorization': `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55SWQiOiI1ZjQ4OTkwNjVhMjc5NzA2YjBjZTgyMTEiLCJjb21wYW55TmFtZSI6IkNvb2xlciIsImlzQWRtaW4iOiIxNTEiLCJ1c2VyVHlwZSI6NCwiaXNTdXBlckFkbWluIjowLCJ1c2VySWQiOiI1ZjQ4OTkxYTVhMjc5NzA2YjBjZTgzNzQiLCJ1c2VyTmFtZSI6IkNvb2xlciIsImlhdCI6MTU5OTg0MDkzOX0.y9UCSb4PUsKtaeuNTHhzCMU8rWDFT2hYySJvIh91jr4`,
            environment:'Live'
          }
        }); 
        if(response){
          // verifying the online paymet integration companies
          let obj = {
            controlpanelid : 41
          }
       //   let onlinecompanies = await this.OnlinePaymentIntegrationCompanies(obj);
         // console.log("onlie companies", onlinecompanies);
          console.log("first data",response.data);
          return { status: 200, data : response.data };
        } else 
        {
          console.log("first error",response);
          return { status: 500, error: response };
        }     
               
    }
    
    async requestwithparam(item){
        try {
            const optionurl = config.baseUrl + item.APiUrl;
            let Datevalue = moment().add(item.NoDays, "days").format("YYYY-MM-DD");
        let query ={
                          companyId:item.companyId,
                          currency:'',
                          startDate:Datevalue,
                          endDate:Datevalue,
                          contractId:'',
                          customerId:'',
                          contractName:'',
                          customerMobile:'',
                          milestonestatusID:'',
                          contactObjId:'' ,
                          environment:item.environment   
                        };
                        console.log("Query is ",query);
                       let url = optionurl + `?companyId=${query.companyId}&currency=${query.currency}&startDate=${query.startDate}&endDate=${query.endDate}&contractId=${query.contractId}&customerId=${query.customerId}&contractName=${query.contractName}&customerMobile=${query.customerMobile}&milestonestatusID=${query.milestonestatusID}&contactObjId=${query.contactObjId}`;    
                      //const url = optionurl + `?companyId=${query.companyId}&startDate=${query.startDate}&endDate=${query.endDate}`;     
                       //console.log("url is :::: " , url);            
        const configinfo = {
            method: 'get',
            url,
            headers: { 'cache-control': 'no-cache',
            authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55SWQiOiI1ZjQ4OTkwNjVhMjc5NzA2YjBjZTgyMTEiLCJjb21wYW55TmFtZSI6IkNvb2xlciIsImlzQWRtaW4iOiIxNTEiLCJ1c2VyVHlwZSI6NCwiaXNTdXBlckFkbWluIjowLCJ1c2VySWQiOiI1ZjQ4OTkxYTVhMjc5NzA2YjBjZTgzNzQiLCJ1c2VyTmFtZSI6IkNvb2xlciIsImlhdCI6MTU5OTg0MDkzOX0.y9UCSb4PUsKtaeuNTHhzCMU8rWDFT2hYySJvIh91jr4',
            environment: item.environment,
            data:item
         }
        }
        //const url = options.url;
        const response = await axios.get(url,{
          headers: {
            'Authorization': `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55SWQiOiI1ZjQ4OTkwNjVhMjc5NzA2YjBjZTgyMTEiLCJjb21wYW55TmFtZSI6IkNvb2xlciIsImlzQWRtaW4iOiIxNTEiLCJ1c2VyVHlwZSI6NCwiaXNTdXBlckFkbWluIjowLCJ1c2VySWQiOiI1ZjQ4OTkxYTVhMjc5NzA2YjBjZTgzNzQiLCJ1c2VyTmFtZSI6IkNvb2xlciIsImlhdCI6MTU5OTg0MDkzOX0.y9UCSb4PUsKtaeuNTHhzCMU8rWDFT2hYySJvIh91jr4`
          }
        });
        if(response){
            console.log("get list response", response);
            let insertarray=[];
            let listdata = response.data.data.contract_data.billingdata;
            if(listdata.length > 0){
              response.data.data.contract_data.billingdata.forEach(element => {
                // console.log("element is ",element);
                let itemArray =[];
                itemArray.push(element);
                 let item ={
                   typeName:'Invoice',
                   companyId:element.ContractInformation.ReceiverDetails.companyID,
                   Value:itemArray,
                   Status:'not processed',
                   CreatedBy:1,
                   isActive:1,
                   environment:config.environment,
                   id:element._id
                 }
                 insertarray.push(item);              
               });
               console.log("post api calling", insertarray);
               const insertresponse=await axios.post(config.baseUrl +'list/create', insertarray,{
                 headers: {
                   'Authorization': `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55SWQiOiI1ZjQ4OTkwNjVhMjc5NzA2YjBjZTgyMTEiLCJjb21wYW55TmFtZSI6IkNvb2xlciIsImlzQWRtaW4iOiIxNTEiLCJ1c2VyVHlwZSI6NCwiaXNTdXBlckFkbWluIjowLCJ1c2VySWQiOiI1ZjQ4OTkxYTVhMjc5NzA2YjBjZTgzNzQiLCJ1c2VyTmFtZSI6IkNvb2xlciIsImlhdCI6MTU5OTg0MDkzOX0.y9UCSb4PUsKtaeuNTHhzCMU8rWDFT2hYySJvIh91jr4`,
                   environment:'Live'
                 } 
               })
               if(insertresponse){
                 return { status: 200, data : response.data };
               }
               else {
                 return { status: 200, error : error };
               }
            } else {
              console.log("No record found to process");
              return { status: 200, data :"No record found to process"}
            }
            
        }
        else {
          return { status: 500, error: "some error occoured" }; 
           
        }
        } catch (error) {
            return { status: 500, error: error }; 
        }
        
    }

   async  OnlinePaymentIntegrationCompanies(query){     
        let url = `integrations/getAdmintegrationById`;
        if(query.id) url = `${url}?id=${query.id}`;
        if(query.controlpanelid) url = `${url}?controlpanelid=${query.controlpanelid}`;
        const response = await axios.get(config.baseUrl + url,{
          headers: {
            'Authorization': `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55SWQiOiI1ZjQ4OTkwNjVhMjc5NzA2YjBjZTgyMTEiLCJjb21wYW55TmFtZSI6IkNvb2xlciIsImlzQWRtaW4iOiIxNTEiLCJ1c2VyVHlwZSI6NCwiaXNTdXBlckFkbWluIjowLCJ1c2VySWQiOiI1ZjQ4OTkxYTVhMjc5NzA2YjBjZTgzNzQiLCJ1c2VyTmFtZSI6IkNvb2xlciIsImlhdCI6MTU5OTg0MDkzOX0.y9UCSb4PUsKtaeuNTHhzCMU8rWDFT2hYySJvIh91jr4`,
            environment:'Live'
          }
        });
        if(response){
          console.log("3", response)
          return { status: 200, data : response };
        }
        else {
          return { status: 200, error : error };
        }
      
    }
    
}
