

import { LightningElement, wire } from 'lwc';
import getProducts from '@salesforce/apex/productListController.getProducts';
import { swiper } from './swiper';

export default class MenuItems extends LightningElement {
        @wire(getProducts)
        products;

        renderedCallback() {
        const container = this.template.querySelector('.slider-container');
        const track = this.template.querySelector('.slider-track');
        const btnPrev = this.template.querySelector('.btn-prev');
        const btnNext = this.template.querySelector('.btn-next');
        const items = this.template.querySelectorAll('.slider-item');
        swiper(container, track, btnPrev, btnNext, items);
                
    }
}



