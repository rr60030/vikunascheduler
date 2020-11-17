const listservice = require('../services/listmasterservice');
const config = require('../util/configuration.json')
module.exports = class ListGenerateController {
    async getcompanineslist(environment) {
        const value = await this.CallCompaniesforlistMethod(environment);
        //console.log(value);
        // this.processinvoicelistforcompanies(value.data);
        if (value.status && value.status == 500) {
            console.log(value.message)
        } else {
            const datavalue = value.data;
            for (const [idx, url] of datavalue.entries()) {
                const todo = await this.callingservice(url);
                // const todo = await masgterlist.prototype.getContractByGroupIds()
                if (!todo) {
                    throw new Error(`HTTP error! status: ${todo.status}`);
                } else {
                    console.log(`Received Todo ${idx + 1}:`, todo);
                }
            }
            console.log('Finished!');
        }
    }

    async processinvoicelistforcompanies(result) {
        // console.log("my reuslt is ", result.data);
        const datavalue = result.data.data;
        for (const [idx, url] of datavalue.entries()) {
            const todo = await this.callingservice(url);
            // const todo = await masgterlist.prototype.getContractByGroupIds()
            if (!todo) {
                throw new Error(`HTTP error! status: ${todo.status}`);
            } else {
                console.log(`Received Todo ${idx + 1}:`, todo);
            }
        }
        console.log('Finished!');
    }
    callingservice(url) {
        return listservice.prototype.GetListStage(url)
            .then((response) => {
                // console.log("Calling service response", response);
                return { status: 200, data: response };
            })
            .catch((error) => {
                return { status: 500, message: error.message }
            });
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