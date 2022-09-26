import { LightningElement,track, wire } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import MINUTES_FIELD from '@salesforce/schema/Order.Minutes__c';

export default class OrderMinutesPicklist extends LightningElement {
    @track pickListValues;
    @track error;

    @wire(getPicklistValues, {
        recordTypeId: '012000000000000AAA',
        fieldApiName: MINUTES_FIELD
    })
    wiredPickListValue({ data, error }) {
        if (data) {
            this.pickListValues = data.values;
            this.error = undefined;
        }
        if (error) {
            this.error = error;
            this.pickListValues = undefined;
        }
    }

    handleChange(event) {
         const minutesValue = new CustomEvent("minutechoseevent", {
        detail: event.detail.value
        });
        this.dispatchEvent(minutesValue);
    }
}