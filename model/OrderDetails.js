export class OrderDetails {
    constructor(order_id, item_code, description, unit_price, get_qty) {
        this.order_id = order_id;
        this.item_code = item_code;
        this.description = description;
        this.unit_price = unit_price;
        this.get_qty = get_qty;
    }
}