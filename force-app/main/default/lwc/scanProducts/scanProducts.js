import { LightningElement, api } from 'lwc';
import { subscribe, unsubscribe, onError } from 'lightning/empApi';
import getOppDetails from '@salesforce/apex/ScanProductController.getOppDetails';


export default class ScanProducts extends LightningElement {
    @api recordId;
    channelName = '/event/Barcode_Scan_Event__e';
    subscription = {};
    isConnected = false;
    itemArray = [];

    retrieveOppDetails() {
        alert(this.recordId);
        getOppDetails({ oppId: this.recordId })
            .then((result) => {
                this.itemArray = result.OpportunityLineItems;
                console.log(result);
            })
            .catch((error) => {
                alert(JSON.stringify(error));
            });
    }

    connectedCallback() {
        this.retrieveOppDetails();
        this.registerErrorListener();
        this.handleSubscribe();
    }

    handleSubscribe() {
        // Callback invoked whenever a new event message is received
        const messageCallback = function (response) {
            console.log('New message received: ', JSON.stringify(response));
            // Response contains the payload of the new message received
        };

        // Invoke subscribe method of empApi. Pass reference to messageCallback
        subscribe(this.channelName, -1, messageCallback).then(response => {
            // Response contains the subscription information on subscribe call
            console.log('Subscription request sent to: ', JSON.stringify(response.channel));
            this.subscription = response;
            this.isConnected = true;
        });
    }

    handleUnsubscribe() {
        // Invoke unsubscribe method of empApi
        unsubscribe(this.subscription, response => {
            console.log('unsubscribe() response: ', JSON.stringify(response));
            // Response is true for successful unsubscribe
        });
    }

    registerErrorListener() {
        // Invoke onError empApi method
        onError(error => {
            console.log('Received error from server: ', JSON.stringify(error));
            // Error contains the server-side error
        });
    }
}