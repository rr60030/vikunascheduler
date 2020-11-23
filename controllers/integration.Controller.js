const config = require('../util/configuration.json');
const listservice = require('../services/listmasterservice');
module.exports = class PaymentIntegration{
    async GetListforPayment(environment) {
        const value = await this.getListforIntegration(environment);      
        if (value.status && value.status == 500) {
            console.log(value.message)
        } else {
            const datavalue = value.data;
            if(datavalue!=undefined){
                for (const [idx, url] of datavalue.entries()) {
                    const todo = await this.invoicecallingservice(url);
                       // const todo = await masgterlist.prototype.getContractByGroupIds()
                       if (!todo) {
                           throw new Error(`HTTP error! status: ${todo.status}`);
                       } else {
                           console.log(`Received Todo ${idx + 1}:`, todo);
                       }
                   }
                   console.log('Finished!');
            } else {
                console.log("No data found");
            }
           
        }
    }

    getListforIntegration(environment) {
        return listservice.prototype.getListforIntegration(environment)
            .then((response) => {
                return { status: 200, data: response.data };
            })
            .catch((error) => {
                return { status: 500, message: error.message }
            });
    }
    invoicecallingservice(url) {
        return listservice.prototype.GetinvoiceList(url)
            .then((response) => {
                // console.log("Calling service response", response);
                return { status: 200, data: response };
            })
            .catch((error) => {
                return { status: 500, message: error.message }
            });
    }

   
}