import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getProductsEntry from '@salesforce/apex/productListController.getProductsEntry';
import createOrder from '@salesforce/apex/productListController.createOrder';
import timeValidation from '@salesforce/apex/productListController.validateOrderTime';
import setOrderTime from '@salesforce/apex/productListController.setOrderTime';



export default class OrderForm extends LightningElement {
    mapSmoothiesEntries = new Map();
    @track value = '';
    previewItems = [];
    totalPrice = 0;
    @track previewData;
    @track optionsArray = [];
    @track count = 1;
    @track minutes = '';
    @track hours = '';
    @track error;
    @track validOrderTime;
    notificationStatus = false;
    commentsInput = '';
    orderId = '';
    orderNumber = '';


    get options() {
        return this.optionsArray;
    }

    // get disableButton(){
    // return this.totalPrice;
// }

    connectedCallback() {
        getProductsEntry().then(result => {
            let arr = [];
            let map = new Map();
            for(let i = 0; i < result.length; i++){
                arr.push({ label: result[i].Name, value: result[i].Product2Id});
                map.set(result[i].Product2Id, result[i]);
             }
            this.optionsArray = arr;
            this.mapSmoothiesEntries = map;
        })
 
    }

    handleChange(event) {
    this.value = event.detail.value;
    }

    handleIncrement() {
    if(this.value){
        this.count = this.count + 1;
        }
    }

    handleDecrement() {
    if(this.count>1){this.count=this.count-1}
    }

    resetPicklistInput() {
        this.count = 1;
        this.value = '';
    }

    resetTimeInput() {
    this.hours = '';
    this.minutes = '';
    }

    clearOrder() {
        this.value = '';
        this.previewItems = [];
        this.totalPrice = 0;
        this.previewData= 0;
        this.count = 1;
        this.minutes = '';
        this.hours = '';
        this.error = undefined;
        this.notificationStatus = false;
        this.validOrderTime = '';
        this.commentsInput = '';
        this.orderId = '';
        this.orderNumber = '';
    }

    scrollForm(){
        this.template.querySelector('.srollBlock').scrollIntoView({
            block: "start",
            behavior: 'smooth'
        })
    }
    
    handleMinutesChange(event) {
        this.minutes = event.detail;
    }

    handleHoursChange(event) {
        this.hours = event.detail;
    }
    
    handleCheckboxChange() {
        this.notificationStatus = !this.notificationStatus;
    }

    handleCommentInput(event) {
        this.commentsInput = event.target.value;
    }

    handleAddProduct() {
        if(this.value!==''){
        this.previewItems.push({
            Name: this.mapSmoothiesEntries.get(this.value).Name,
            Quantity: this.count,
            Price: this.mapSmoothiesEntries.get(this.value).UnitPrice * this.count,
            Product2Id: this.value,
            PricebookEntryId: this.mapSmoothiesEntries.get(this.value).Id,
            UnitPrice: this.mapSmoothiesEntries.get(this.value).UnitPrice
        });
        this.totalPrice = this.totalPrice + this.mapSmoothiesEntries.get(this.value).UnitPrice * this.count;
        this.previewData = this.previewItems.length;
        this.resetPicklistInput()
        }
        this.scrollForm();
        }
    
    handleConfirmfOrder() {
        if (this.hours === '' || this.minutes === '') {
            this.validOrderTime = true;
        }else{
        timeValidation({ flowOutput: [[this.hours, this.minutes]] }).then(result => {
            createOrder({
            choise: result.toString(),
            jsonData: JSON.stringify(this.previewItems),
            comments: this.commentsInput,
            notificationStatus: this.notificationStatus
            }).then(data => {
                    this.orderId = data.Id;
                    this.orderNumber = data.OrderNumber;
                    setOrderTime({flowOutput: [[this.orderId, this.hours, this.minutes]]})
                    const toastEvent = new ShowToastEvent({
                        title: 'Success!',
                        message: `Order №${data.OrderNumber} Record is Created Successfully`,
                        variant: 'success',
                    })
                    this.dispatchEvent(toastEvent);
                    console.log('OrderId FROM APEX: ' + this.orderId);
                    console.log('OrderNumber FROM APEX: ' + this.orderNumber);
                    this.clearOrder()
            }).catch(error => {
                    this.error = error.message
                    const toastEvent = new ShowToastEvent({
                        title: 'Error!',
                        message: `Error, time cannot be less than now`,
                        variant: 'error',
                    })
                    this.dispatchEvent(toastEvent);
                })
            })
            }
        }
    }
