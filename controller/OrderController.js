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

// add item to cart
$("#cart_btns>button[type='button']").eq(0).on("click", () => {
    let order_id = $("#order_id").val();
    let order_item_code = $("#order_item_code").val();
    let order_item_description = $("#order_item_description").val();
    let total_item_qty = $("#total_item_qty").val();
    let order_item_unit_price = $("#order_item_unit_price").val();
    let order_get_item_qty = $("#order_get_item_qty").val();
    if(order_id){
        if (orderIdPattern.test(order_id)) {
            if (order_item_code && order_get_item_qty) {
                if(parseInt(order_get_item_qty)<=parseInt(total_item_qty) && parseInt(order_get_item_qty)>0) {
                    if(isAvailableCode(order_id, order_item_code)) {
                        let order_detail = temp_cart_db.find(order_detail => order_detail.order_id === order_id && order_detail.item_code === order_item_code);
                        let remove_index = temp_cart_db.findIndex(item => item.order_id === order_id && item.item_code === order_item_code);
                        let inCart_count = parseInt(order_detail.get_qty);
                        let new_count = inCart_count + parseInt(order_get_item_qty);
                        temp_cart_db.splice(remove_index,1);
                        let cart_item_obj = new OrderDetails(order_id, order_item_code, order_item_description, order_item_unit_price, new_count);
                        temp_cart_db.push(cart_item_obj);
                        sub_total -= (order_item_unit_price * inCart_count);
                        sub_total += order_item_unit_price * new_count;
                        document.getElementById("subTotal").innerHTML = "Sub Total : Rs. "+sub_total;
                        $("#cart_btns>button[type='reset']").click();
                        loadCartItemData();
                    } else {
                        let cart_item_obj = new OrderDetails(order_id, order_item_code, order_item_description, order_item_unit_price, order_get_item_qty);
                        temp_cart_db.push(cart_item_obj);
                        sub_total += order_item_unit_price * order_get_item_qty;
                        document.getElementById("subTotal").innerHTML = "Sub Total : Rs. "+sub_total;
                        $("#cart_btns>button[type='reset']").click();
                        loadCartItemData();
                    }
                } else { toastr.error('Invalid Quantity!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"});}
            }else{ toastr.error('Fields can not be empty!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"});}
        } else { toastr.error('Invalid Order ID format!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"});}
    }else{ toastr.error('Order ID can not be empty!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"});}
});

// remove item from cart
$("#cart_btns>button[type='button']").eq(1).on("click", () => {
    let order_id = $("#order_id").val();
    let order_item_code = $("#order_item_code").val();
    let order_item_description = $("#order_item_description").val();
    let order_item_unit_price = $("#order_item_unit_price").val();
    let order_get_item_qty = $("#order_get_item_qty").val();
    if(order_id){
        if (orderIdPattern.test(order_id)) {
            if (order_item_code && order_get_item_qty) {
                if(isAvailableCode(order_id, order_item_code)) {
                    let cart_item_data = temp_cart_db.find(order_detail => order_detail.order_id === order_id && order_detail.item_code === order_item_code);
                    let remove_index = temp_cart_db.findIndex(order_detail => order_detail.order_id === order_id && order_detail.item_code === order_item_code);
                    if (cart_item_data) {
                        if (order_get_item_qty === cart_item_data.get_qty) {
                            temp_cart_db.splice(remove_index, 1);
                            sub_total -= order_item_unit_price * order_get_item_qty;
                            document.getElementById("subTotal").innerHTML = "Sub Total : Rs. "+sub_total;
                            $("#cart_btns>button[type='reset']").click();
                            loadCartItemData();
                        } else if(order_get_item_qty < cart_item_data.get_qty && order_get_item_qty > 0){
                            let inCart_count = parseInt(cart_item_data.get_qty);
                            let new_count = inCart_count - parseInt(order_get_item_qty);
                            temp_cart_db[remove_index] = new OrderDetails(order_id, order_item_code, order_item_description, order_item_unit_price, new_count);
                            sub_total -= (order_item_unit_price * inCart_count);
                            sub_total += order_item_unit_price * new_count;
                            document.getElementById("subTotal").innerHTML = "Sub Total : Rs. "+sub_total;
                            $("#cart_btns>button[type='reset']").click();
                            loadCartItemData();
                        } else { toastr.error('Invalid Quantity!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"}); }
                    } else { toastr.error('This item is not available to remove!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"});}
                } else { toastr.error('This Item is not available in this order!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"});}
            }else{ toastr.error('Fields can not be empty!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"}); }
        } else { toastr.error('Invalid Order ID format!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"});}
    }else{ toastr.error('Order ID can not be empty!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"});}
});

$("#cart_btns>button[type='reset']").eq(0).on("click", () => {
    $('#item_select').empty();
    loadItems();
});

$("#customer_select").on("change", function() {
    let selectedCustomerID = $(this).val();
    let customer_data = customer_db.find(customer => customer.customer_id === selectedCustomerID);
    if (customer_data) {
        $("#order_customer_name").val(customer_data.name);
    }else{
        clear_form1();
    }
});

$("#item_select").on("change", function() {
    $("#order_get_item_qty").val("");
    let order_id = $("#order_id").val();
    let selectedItem = $(this).val();
    let item_data = item_db.find(item => item.item_code === selectedItem);
    if (item_data) {
        $("#order_item_code").val(item_data.item_code);
        $("#order_item_description").val(item_data.description);
        $("#order_item_unit_price").val(item_data.unit_price);
        let cart_item_data = temp_cart_db.find(item => item.item_code === selectedItem);
        if (cart_item_data && !isAvailableID(order_id)) {
            let actual_item_qty = item_data.qty_on_hand;
            let in_cart_item_qty = cart_item_data.get_qty;
            $("#total_item_qty").val(actual_item_qty - in_cart_item_qty);
        }else{
            $("#total_item_qty").val(item_data.qty_on_hand);
        }
    }else{
        $("#cart_btns>button[type='reset']").eq(0).click();
    }
});

function updateItemQuantities() {
    for (let i = 0; i < temp_cart_db.length; i++) {
        let itemCode = temp_cart_db[i].item_code;
        let get_qty = temp_cart_db[i].get_qty;
        let item_data = item_db.find(item => item.item_code === itemCode);
        if (item_data) {
            let description = item_data.description;
            let unit_price = item_data.unit_price;
            let qty_on_hand = item_data.qty_on_hand;
            let updated_qty = qty_on_hand - get_qty;
            let item_obj = new Item(itemCode, description, unit_price, updated_qty);
            let index = item_db.findIndex(item => item.item_code === itemCode);
            item_db[index] = item_obj;
        }
    }
}

function addOrderDetails() {
    order_details_db.push(...temp_cart_db);
    temp_cart_db = [];
}

function removeOrderDetails(order_id) {
    for (let i = order_details_db.length - 1; i >= 0; i--) {
        if (order_details_db[i].order_id === order_id) {
            order_details_db.splice(i, 1);
        }
    }
}

// place order
$("#btn_place_order").on("click", () => {
    let order_id = $("#order_id").val();
    let date = $("#date").val();
    let order_customer_id = $("#customer_select").val();
    let order_customer_name = $("#order_customer_name").val();
    let cash = $("#cash").val();
    let discount = $("#discount").val();
    let total = sub_total - (sub_total * discount/100);
    if(order_id){
        if (orderIdPattern.test(order_id)) {
            if(!isAvailableID(order_id)) {
                if (order_customer_name) {
                    if(discountPattern.test(discount)) {
                        if(total>0){
                            if(cash>=total){
                                let order_obj = new Order(order_id, date, order_customer_id, discount, total);
                                order_db.push(order_obj);
                                updateItemQuantities();
                                addOrderDetails();
                                $("#order_btns>button[type='button']").eq(2).click();
                                $("#cart_btns>button[type='reset']").eq(0).click();
                                loadOrderData();
                                clear_form3();
                                $('#order_item_tbl_body').empty();
                                Swal.fire({width: '225px', position: 'center', icon: 'success', title: 'Saved!', showConfirmButton: false, timer: 2000});
                            } else { toastr.error('Insufficient cash!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"});}
                        } else { toastr.error('Invalid total!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"});}
                    } else { toastr.error('Invalid Discount input!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"});}
                }else{ toastr.error('Enter valid Customer ID!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"});}
            } else { toastr.error('This Order ID is already exist!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"});}
        } else { toastr.error('Invalid Order ID format!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"});}
    }else{ toastr.error('Order ID can not be empty!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"});}
});

