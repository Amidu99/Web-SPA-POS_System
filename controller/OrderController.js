import {customer_db, item_db, order_db, order_details_db} from "../db/DB.js";
import {Order} from "../model/Order.js";
import {OrderDetails} from "../model/OrderDetails.js";
import {Item} from "../model/Item.js";

const orderIdPattern = /^[O]-\d{4}$/;
const discountPattern = /^(?:0|[1-9]\d?)(?:\.\d{1,2})?$/;
var temp_cart_db = [];
let order_row_index = null;
let item_row_index = null;
let sub_total = 0.00;

const clear_form1 = () => {
    const nextId = generateNextId();
    $("#order_id").val(nextId);
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    let formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    $("#date").val(formattedDate);
    $("#order_customer_name").val("");
    $("#order_total").val("");
    sub_total = 0.00;
}

const clear_form3 = () => {
    $("#cash").val("");
    $("#discount").val("");
    $("#balance").val("");
    document.getElementById("total").innerHTML = "Total : Rs. 0.00";
    document.getElementById("subTotal").innerHTML = "SubTotal : Rs. 0.00";
}
