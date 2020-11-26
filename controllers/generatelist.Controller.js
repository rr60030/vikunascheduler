const listservice = require('../services/listmasterservice');
const config = require('../util/configuration.json');
const moment = require('moment');
module.exports = class GenerateInvoiceListController {
    async getcompanineslist(environment) {
        console.log("*****Get CompanyIDs + Time (Schedular)*****");
        const value = await this.CallCompaniesforlistMethod(environment);      
        if (value.status && value.status == 500) {
            console.log(value.message)
        } else {
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
                    if(invoicerecords.data && invoicerecords.data.data){
                        let insertarray = [];
                        let listdata = invoicerecords.data.data.contract_data.billingdata;
                        if (listdata.length > 0) {
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
                                  id: element._id,
                                  parameters:integrationarray[0].parameters,
                                  integratorname:integrationarray[0].integratorname,
                                  integrationid:integrationarray[0]._id,
                                  admIntegrationId:integrationarray[0].admIntegrationId
                                }
                                insertarray.push(item);
                              });
                              console.log(`*****Records found for ${url.companyId}*****`);
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
                            console.log(`*****No Records found for ${url.companyId}*****`);
                        }
                    } else {
                        console.log(`*****No Records found for ${url.companyId}*****`);
                    }

                   } else {
                       console.log("*****Payment integration not yet done*****");
                   }
                   
                   
                }
            }
            console.log('Finished!');
        }
    }
    CallCompaniesforlistMethod(environment) {
        return listservice.prototype.GetCompaniesforlist(environment)
            .then((response) => {
                return { status: 200, data: response.data };
            })
            .catch((error) => {
                return { status: 500, message: error.message }
            });
    }
}