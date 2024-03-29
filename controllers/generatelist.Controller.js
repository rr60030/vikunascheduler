const listservice = require('../services/listmasterservice');
const config = require('../util/configuration.json');
const moment = require('moment');
module.exports = class GenerateInvoiceListController {
    async getcompanineslist(environment,scheduletime) {
        console.log("*****Get CompanyIDs + Time (Schedular)*****");
        let query ={            
            ListGenTime:scheduletime
        }
        const value = await this.CallCompaniesforlistMethod(environment,query);      
        if (value.status && value.status == 500) {
            console.log(value.message)
        } else {
            if(value && value.data.length > 0){
            const datavalue = value.data;
            for (const [idx, url] of datavalue.entries()) {
               // console.log(`environment:${url.environment}, CompanyID:${url.companyId}`);
                //GetOnlinePaymentCredentials
                console.log("*****GetOnlinePaymentCredentials*****");
                let obj = { controlpanelid: 41 };
                let  companyID = {companyId: url.companyId  };
                const todo = await listservice.prototype.GetOnlinePaymentCredentials(obj,companyID,url.environment);               
                if (!todo) {
                    throw new Error(`HTTP error! status: ${todo.status}`);
                } else {
                  // console.log(`Received Todo ${idx + 1}:`, todo);
                   const integrationarray=[];
                   todo.data.forEach(element =>{
                       if(element.connected && element.connected.integrationStatus)
                       {
                        integrationarray.push(element);
                       }
                   });
                  // console.log("onlinepayment",integrationarray);
                   if(integrationarray.length > 0) {
                    const optionurl = config.baseUrl + url.APiUrl;
                    let Datevalue = moment().add(url.NoDays, "days").format("YYYY-MM-DD");
                    let query = {
                        companyId: url.companyId,
                        currency: url.Currency,
                        startDate: Datevalue,
                        endDate: Datevalue,
                        contractId: '',
                        customerId: '',
                        contractName: '',
                        customerMobile: '',
                        milestonestatusID: '',
                        contactObjId: '',
                        environment: url.environment
                    };
                    const invoicerecords = await listservice.prototype.fetchlistrecords(query,optionurl);
                 
                    if(invoicerecords.data && invoicerecords.data.data && invoicerecords.data.data.contract_data.billingdata.length > 0
                        ){
                            const listitemarry =[];
                            invoicerecords.data.data.contract_data.billingdata.forEach(element =>{
                                if(element.liststatus == 0){
                                    listitemarry.push(element);
                                }
                            })
                        let insertarray = [];
                        let listdata = invoicerecords.data.data.contract_data.billingdata;
                        if (listitemarry.length > 0) {
                            listitemarry.forEach(element => {           
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
                                  id: element._id,
                                  parameters:integrationarray[0].parameters,
                                  integratorname:integrationarray[0].integratorname,
                                  integrationid:integrationarray[0].connected._id,
                                  admIntegrationId:integrationarray[0].connected.admIntegrationId
                                 
                                }
                                insertarray.push(item);
                              });
                              console.log(`*****Records found for ${url.companyId}  to generate list*****`);
                              insertarray.forEach(arrelement =>{
                                arrelement.Value.forEach(element => {
                                    element.milestoneamount = element.milestoneamount.$numberDecimal;
                                    element.milestoneamountwithouttax = element.milestoneamountwithouttax.$numberDecimal;
                                    element.taxamount =element.taxamount.$numberDecimal;
                                    element.milestonepercentage = element.milestonepercentage.$numberDecimal;
                                  });
                              });
                             
                              const insertresponse = await listservice.prototype.createlistmaster(insertarray);
                              if(insertresponse){
                                console.log(`*****Records inserted in staging table for ${url.companyId}*****`);
                              } else{

                              }
                             
                        } else {
                            console.log(`*****No Records found for ${url.companyId}  to generate list*****`);
                        }
                    } else {
                        console.log(`*****No Records found for ${url.companyId}  to generate list*****`);
                    }

                   } else {
                       console.log("*****Payment integration not yet done*****");
                   }
                   
                   
                }
            }
            console.log('Finished!');
        } else {
            console.log("No scheduled companies found");
            console.log('Finished!');
        }
        }
    }
    CallCompaniesforlistMethod(environment,query) {
        return listservice.prototype.GetCompaniesforlist(environment,query)
            .then((response) => {
                return { status: 200, data: response.data };
            })
            .catch((error) => {
                return { status: 500, message: error.message }
            });
    }

    async processinvoicepayment(environment,scheduletime){
        console.log("*****Get CompanyIDs + Time (Schedular) for invoice generation*****");
        let query ={
            ListDispTime:scheduletime           
        }
        const value = await this.CallCompaniesforlistMethod(environment,query);      
        if (value.status && value.status == 500) {
            console.log(value.message)
        } else {
            if(value && value.data.length > 0){
            const datavalue = value.data;
            for (const [idx, url] of datavalue.entries()) {
               // console.log(`environment:${url.environment}, CompanyID:${url.companyId}`);
                //GetOnlinePaymentCredentials
                console.log("*****GetOnlinePaymentCredentials*****");               
                const todo = await listservice.prototype.fetchstagerecords(url);               
                if (!todo) {
                    throw new Error(`HTTP error! status: ${todo.status}`);
                } else {         
                    if(todo.data.data.length > 0){
                        const gatewayname = todo.data.data[0].integratorname;
                        const paymentcred = {
                            companyId:todo.data.data[0].companyId,
                            environment:todo.data.data[0].environment,
                            integrationid:todo.data.data[0].integrationid
                        }
                        const APICredential = await listservice.prototype.GetAPICredentials(paymentcred);
                        if(APICredential){
                            let getwaycred ={
                                ...APICredential,
                                gatewayname:gatewayname
                            }
                            for (const [indx, item] of todo.data.data.entries()) {   
                                let stagerecordid =item._id;                              
                                const invoicedetails = await this.GetinvoiceList(item);
                                if(invoicedetails) {
                                    console.log(`safety kosam${indx}`);
                                    // invoicedetails.forEach(async (x)=>{
                                        const getwayresponse = await listservice.prototype.sendtopaymentgateway(invoicedetails.data,getwaycred,stagerecordid);
                                        if(getwayresponse && getwayresponse.status ==200){
                                            console.log(`invoice generated for ${item.companyId}`);
                                        } else {
                                            // if(getwayresponse.error.response){
                                            // console.log(`Failed for  ${item.companyId} reason is ${JSON.stringify(getwayresponse.error.response.data.message)}  `);
                                            // } else {
                                            //     console.log(getwayresponse.error.code);
                                            // }
                                            let message = { status:getwayresponse.status,message:getwayresponse.message};
                                            console.log(message);
                                        }

                                    // })
                                }

                            }
                            console.log("success");
                        }

                    } else {
                        console.log("*****no records for invoice*****")
                    }      
                //    const integrationarray=[];
                //    todo.data.forEach(element =>{
                //        if(element.connected && element.connected.integrationStatus)
                //        {
                //         integrationarray.push(element);
                //        }
                //    });                  
                //    if(integrationarray.length > 0) {
                //        const PaymentCredents = await listservice.prototype.GetAPICredentials(integrationarray);
                //    } 
                   
                   
                }
            }
            console.log('Finished!');
        } else {
            console.log("No scheduled companies found for invoice generation");
            console.log('Finished!');
        }
        }   

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
        let invoiceintegrationlist = await listservice.prototype.backendrequest(item);
       
        // logger.info("Application fetched the info for razer pay" ,JSON.stringify(invoiceintegrationlist.data.data.data));
        if (invoiceintegrationlist) {
          let stageinvdata = invoiceintegrationlist.data.data.data;         
          //return invoiceintegrationlist;
          return { status: 200, data: stageinvdata }; 
        } else {
          return { status: 500, error: "some error occoured" }; 
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
}