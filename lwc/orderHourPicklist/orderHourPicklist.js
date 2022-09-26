import { LightningElement, wire,track } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import HOURS_FIELD from '@salesforce/schema/Order.Hours__c';

export default class OrderHourPicklist extends LightningElement {
    @track pickListValues;
    @track error;

    @wire(getPicklistValues, {
        recordTypeId: '012000000000000AAA',
        fieldApiName: HOURS_FIELD
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
        const hoursValue = new CustomEvent("hourschoseevent", {
        detail: event.detail.value
        });
        this.dispatchEvent(hoursValue);
    }
}