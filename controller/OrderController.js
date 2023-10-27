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

$("#order_id").on('keypress' , ()=> { $("#customer_select").focus(); });
$("#cash").on('keypress' , ()=> { $("#discount").focus(); });

function isAvailableID(order_id) {
    let order = order_db.find(order => order.order_id === order_id);
    return !!order;
}

function isAvailableForUpdate(order_id) {
    let order_detail = temp_cart_db.find(order_detail => order_detail.order_id === order_id);
    return !!order_detail;
}

function isAvailableCode(order_id, item_code) {
    let order_detail = temp_cart_db.find(order_detail => order_detail.order_id === order_id && order_detail.item_code === item_code);
    return !!order_detail;
}

function generateNextId() {
    order_db.sort((a, b) => a.order_id.localeCompare(b.order_id));
    if (order_db.length === 0) { return "O-0001"; }
    const last = order_db[order_db.length - 1];
    const lastIdNumber = parseInt(last.order_id.slice(2), 10);
    const nextIdNumber = lastIdNumber + 1;
    return `O-${nextIdNumber.toString().padStart(4, '0')}`;
}

const loadCustomers = () => {
    let title = $('<option>', { text: '-Set Customer-', value: 'title' });
    $("#customer_select").append(title);
    customer_db.map((customer, index) => {
        let option = $('<option>', { text: customer.customer_id, value: customer.customer_id });
        $("#customer_select").append(option);
    });
};

const loadItems = () => {
    let title = $('<option>', { text: '-Select Item-', value: 'title' });
    $("#item_select").append(title);
    item_db.map((item, index) => {
        let option = $('<option>', { text: item.item_code, value: item.item_code });
        $("#item_select").append(option);
    });
};

// load cart table
const loadCartItemData = () => {
    $('#order_item_tbl_body').empty();
    temp_cart_db.map((cartItemData, index) => {
        let unitPrice = parseFloat(cartItemData.unit_price);
        let quantity = parseInt(cartItemData.get_qty);
        let total = unitPrice * quantity;
        let record = `<tr>
                        <td class="item_code">${cartItemData.item_code}</td>
                        <td class="description">${cartItemData.description}</td>
                        <td class="unit_price">${unitPrice}</td>
                        <td class="get_qty">${quantity}</td>
                        <td class="item_total">${total}</td>
                      </tr>`;
        $("#order_item_tbl_body").append(record);
    });
};

// load order table
const loadOrderData = () => {
    $('#order_tbl_body').empty();
    order_db.map((order, index) => {
        let record = `<tr>
                        <td class="order_id">${order.order_id}</td>
                        <td class="date">${order.date}</td>
                        <td class="customer_id">${order.customer_id}</td>
                        <td class="discount">${order.discount}</td>
                        <td class="order_total">${order.total}</td>
                      </tr>`;
        $("#order_tbl_body").append(record);
    });
};

$("#order_btns>button[type='button']").eq(2).on("click", () => {
    $('#customer_select').empty();
    loadCustomers();
    clear_form1();
    clear_form3();
    temp_cart_db = [];
    loadCartItemData();
});

