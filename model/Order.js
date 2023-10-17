export class Order {
    constructor(order_id, date, customer_id, discount, total) {
        this.order_id = order_id;
        this.date = date;
        this.customer_id = customer_id;
        this.discount = discount;
        this.total = total;
    }
}