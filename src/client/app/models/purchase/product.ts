import { factory } from '@cinerino/sdk';
import * as moment from 'moment';

/**
 * Product
 */
export class Product {
    public data: factory.product.IProduct;
    public now: Date;

    constructor(params: { product: factory.product.IProduct; now?: Date }) {
        this.data = params.product;
        this.now = params.now === undefined ? moment().toDate() : params.now;
    }

    /**
     * 販売判定
     */
    public isSales(status?: 'start' | 'end') {
        const product = this.data;
        if (product.offers === undefined) {
            return false;
        }
        const offers = product.offers[0];
        if (offers === undefined) {
            return false;
        }
        let result = false;
        const criteria = moment(this.now).unix();
        const validFrom = moment(offers.validFrom).unix();
        const validThrough = moment(offers.validThrough).unix();
        switch (status) {
            case 'start':
                result = !(validFrom < criteria);
                break;
            case 'end':
                result = !(validThrough > criteria);
                break;
            default:
                result = validFrom < criteria && validThrough > criteria;
                break;
        }
        return result;
    }
}
