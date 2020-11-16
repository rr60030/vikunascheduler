const listservice = require('../services/listmasterservice');
const config = require('../util/configuration.json')
module.exports = class ListGenerateController {
    async getDefaulBillingStatus(environment) {        
        const value = await this.getwatcherscollabarators(environment);
        //console.log(value);
        this.setTodoList(value.data);
    }

    async setTodoList(result) {
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
    getwatcherscollabarators(environment) {
        return listservice.prototype.getBillingDefaultStatus(environment)
            .then((response) => {
                return { status: 200, data: response };
            })
            .catch((error) => {
                return { status: 500, message: error.message }
            });
    }
}