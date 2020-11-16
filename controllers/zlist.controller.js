var express = require('express');
var router = express.Router();
var moment = require('moment');
var asyncLoop = require('node-async-loop');
const listgenerateservice = require('../services/listzgenerate.service');
getCompanyListData=(req,res,next) =>{
    
  const companylist = listgenerateservice.getCompanylist();
  console.log(companylist); 

};
// getInvoiceData = (req, res, next) =>  {
//     let companyId = this._localstorage.getUser().companyId;
//     let query = {
//       companyId : companyId,
//       startDate : this.milestoneStartDate,
//       endDate : this.milestoneEndDate,
//       milestonestatusID : this.selBillingStatus,
//       ...this.filterValue
//     }
//     console.log(query)
//     this._invoice.getInvoice(query).pipe(takeUntil(this.destroy$)).subscribe(res=>{
//       // console.log(res)
//       let data = res['data'];
//       if(data){
//         this.billingCountArr = data['billingCount'];
//         this.reportData = data['contract_data'];
//         this.createPaymentData(this.reportData);
//         // this.createPaymentData(data['contract_data'].billingdata, data['contract_data'].eventdata);
//       }
//     })
//   }
  module.exports = router;