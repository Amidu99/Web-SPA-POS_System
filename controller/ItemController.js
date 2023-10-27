import {Item} from "../model/Item.js";
import {item_db} from "../db/DB.js";

const itemCodePattern = /^[I]-\d{4}$/;
const descriptionPattern = /^[a-zA-Z0-9 '.-]{4,}$/;
const pricePattern = /^(?:[1-9]\d{0,4})(?:\.\d{1,2})?$/;
const qtyPattern = /^(?:0|[1-9]\d{0,4})(?:\.\d{1,2})?$/;
let row_index = null;

const loadItemData = () => {
    $('#item_tbl_body').empty();
    item_db.map((item, index) => {
        let record = `<tr><td class="item_code">${item.item_code}</td><td class="description">${item.description}</td>
                      <td class="unit_price">${item.unit_price}</td><td class="qty_on_hand">${item.qty_on_hand}</td></tr>`;
        $("#item_tbl_body").append(record);
    });
};

function isAvailableID(item_code) {
    let item = item_db.find(item => item.item_code === item_code);
    return !!item;
}

$("#item_code").on('keypress' , ()=> { $("#description").focus(); });
$("#description").on('keypress' , ()=> { $("#unit_price").focus(); });
$("#unit_price").on('keypress' , ()=> { $("#item_qty").focus();});

// save item
$("#item_btns>button[type='button']").eq(0).on("click", () => {
    let item_code = $("#item_code").val();
    let description = $("#description").val();
    let unit_price = $("#unit_price").val();
    let qty_on_hand = $("#item_qty").val();
    if(item_code && description && unit_price && qty_on_hand){
        if (itemCodePattern.test(item_code)) {
            if(!isAvailableID(item_code)){
                if (descriptionPattern.test(description)) {
                    if (pricePattern.test(unit_price)) {
                        if (qtyPattern.test(qty_on_hand)) {
                        let item_obj = new Item(item_code, description, unit_price, qty_on_hand);
                        item_db.push(item_obj);
                        $("#item_btns>button[type='button']").eq(3).click();
                        loadItemData();
                            Swal.fire({width: '225px', position: 'center', icon: 'success', title: 'Saved!', showConfirmButton: false, timer: 2000});
                        } else { toastr.error('Invalid quantity input!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"});}
                    } else { toastr.error('Invalid price input!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"});}
                } else { toastr.error('Invalid description!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"});}
            } else { toastr.error('This Code is already exist!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"});}
        } else { toastr.error('Invalid item code format!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"});}
    }else{ toastr.error('Fields can not be empty!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"});}
});

// update item
$("#item_btns>button[type='button']").eq(1).on("click", () => {
    let item_code = $("#item_code").val();
    let description = $("#description").val();
    let unit_price = $("#unit_price").val();
    let qty_on_hand = $("#item_qty").val();
    if(item_code && description && unit_price && qty_on_hand) {
        if (itemCodePattern.test(item_code)) {
            if(isAvailableID(item_code)) {
                if (descriptionPattern.test(description)) {
                    if (pricePattern.test(unit_price)) {
                        if (qtyPattern.test(qty_on_hand)) {
                            let item_obj = new Item(item_code, description, unit_price, qty_on_hand);
                            let index = item_db.findIndex(item => item.item_code === item_code);
                            item_db[index] = item_obj;
                            $("#item_btns>button[type='button']").eq(3).click();
                            loadItemData();
                            Swal.fire({width: '225px', position: 'center', icon: 'success', title: 'Updated!', showConfirmButton: false, timer: 2000});
                        } else { toastr.error('Invalid quantity input!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"});}
                    } else { toastr.error('Invalid price input!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"});}
                } else { toastr.error('Invalid description!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"});}
            } else { toastr.error('This Code is not exist!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"});}
        } else { toastr.error('Invalid item code format!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"});}
    } else { toastr.error('Fields can not be empty!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"});}
});

// delete item
$("#item_btns>button[type='button']").eq(2).on("click", () => {
    let item_code = $("#item_code").val();
    if(item_code){
        if (itemCodePattern.test(item_code)) {
            if(isAvailableID(item_code)) {
                Swal.fire({width: '300px', title: 'Delete Item', text: "Are you sure you want to permanently remove this item?", icon: 'warning',
                showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', confirmButtonText: 'Yes, delete!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        let index = item_db.findIndex(item => item.item_code === item_code);
                        item_db.splice(index, 1);
                        $("#item_btns>button[type='button']").eq(3).click();
                        loadItemData();
                        Swal.fire({width: '225px', position: 'center', icon: 'success', title: 'Deleted!', showConfirmButton: false, timer: 2000});
                    }
                })
            } else { toastr.error('This Code is not exist!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"});}
        } else { toastr.error('Invalid item code format!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"});}
    } else { toastr.error('Item Code can not be empty!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"});}
});

// reset form
$("#item_btns>button[type='button']").eq(3).on("click", () => {
    loadItemData();
    $("#description").val("");
    $("#unit_price").val("");
    $("#item_qty").val("");
    item_db.sort((a, b) => a.item_code.localeCompare(b.item_code));
    if (item_db.length === 0) { $("#item_code").val("I-0001"); }
    else{
        const last = item_db[item_db.length - 1];
        const lastIdNumber = parseInt(last.item_code.slice(2), 10);
        const nextIdNumber = lastIdNumber + 1;
        const nextId = `I-${nextIdNumber.toString().padStart(4, '0')}`;
        $("#item_code").val(nextId);
    }
});

// retrieve by table click
$("#item_tbl_body, #item_search_tbl_body").on("click", "tr", function() {
    row_index = $(this).index();
    let item_id = $(this).find(".item_code").text();
    let description = $(this).find(".description").text();
    let unit_price = $(this).find(".unit_price").text();
    let qty_on_hand = $(this).find(".qty_on_hand").text();
    $("#item_code").val(item_id);
    $("#description").val(description);
    $("#unit_price").val(unit_price);
    $("#item_qty").val(qty_on_hand);
});
