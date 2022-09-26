import { LightningElement, api } from 'lwc';
import picture from '@salesforce/resourceUrl/smoothieIcon';

export default class Productitem extends LightningElement {
    logoURL = picture;
    @api product;
}