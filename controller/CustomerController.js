import {Customer} from "../model/Customer.js";
import {customer_db} from "../db/DB.js";

const customerIdPattern = /^[C]-\d{4}$/;
const namePattern = /^[a-zA-Z '.-]{4,}$/;
const addressPattern = /^[a-zA-Z0-9 ',.-]{5,}$/;
const salaryPattern = /^(?:[1-9]\d{0,5})(?:\.\d{1,2})?$/;
let row_index = null;

const loadCustomerData = () => {
    $('#customer_tbl_body').empty();
    customer_db.map((customer, index) => {
        let record = `<tr><td class="customer_id">${customer.customer_id}</td><td class="name">${customer.name}</td>
                      <td class="address">${customer.address}</td><td class="salary">${customer.salary}</td></tr>`;
        $("#customer_tbl_body").append(record);
    });
};

function isAvailableID(customer_id) {
    let customer = customer_db.find(customer => customer.customer_id === customer_id);
    return !!customer;
}

$("#customer_id").on('keypress' , ()=> { $("#customer_name").focus(); });
$("#customer_name").on('keypress' , ()=> { $("#customer_address").focus(); });
$("#customer_address").on('keypress' , ()=> { $("#customer_salary").focus();});

// save customer
$("#customer_btns>button[type='button']").eq(0).on("click", () => {
    let customer_id = $("#customer_id").val();
    let name = $("#customer_name").val();
    let address = $("#customer_address").val();
    let salary = $("#customer_salary").val();
    if(customer_id && name && address && salary){
        if (customerIdPattern.test(customer_id)) {
            if(!isAvailableID(customer_id)){
                if (namePattern.test(name)) {
                    if (addressPattern.test(address)) {
                        if (salaryPattern.test(salary)) {
                            let customer_obj = new Customer(customer_id, name, address, salary);
                            customer_db.push(customer_obj);
                            $("#customer_btns>button[type='button']").eq(3).click();
                            loadCustomerData();
                            Swal.fire({width: '225px', position: 'center', icon: 'success', title: 'Saved!', showConfirmButton: false, timer: 2000});
                        } else { toastr.error('Invalid salary input!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"});}
                    } else { toastr.error('Invalid address input!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"});}
                } else { toastr.error('Invalid name input!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"});}
            } else { toastr.error('This ID is already exist!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"});}
        } else { toastr.error('Invalid customer ID format!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"});}
    }else{ toastr.error('Fields can not be empty!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"})}
});

// update customer
$("#customer_btns>button[type='button']").eq(1).on("click", () => {
    let customer_id = $("#customer_id").val();
    let name = $("#customer_name").val();
    let address = $("#customer_address").val();
    let salary = $("#customer_salary").val();
    if(customer_id && name && address && salary) {
        if (customerIdPattern.test(customer_id)) {
            if(isAvailableID(customer_id)) {
                if (namePattern.test(name)) {
                    if (addressPattern.test(address)) {
                        if (salaryPattern.test(salary)) {
                            let customer_obj = new Customer(customer_id, name, address, salary);
                            let index = customer_db.findIndex(customer => customer.customer_id === customer_id);
                            customer_db[index] = customer_obj;
                            $("#customer_btns>button[type='button']").eq(3).click();
                            loadCustomerData();
                            Swal.fire({width: '225px', position: 'center', icon: 'success', title: 'Updated!', showConfirmButton: false, timer: 2000});
                        } else { toastr.error('Invalid salary input!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"});}
                    } else { toastr.error('Invalid address input!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"});}
                } else { toastr.error('Invalid name input!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"});}
            } else { toastr.error('This ID is not exist!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"});}
        } else { toastr.error('Invalid customer ID format!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"});}
    }else{ toastr.error('Fields can not be empty!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"});}
});

// delete customer
$("#customer_btns>button[type='button']").eq(2).on("click", () => {
    let customer_id = $("#customer_id").val();
    if(customer_id){
        if (customerIdPattern.test(customer_id)) {
            if(isAvailableID(customer_id)) {
                Swal.fire({width: '300px', title: 'Delete Customer', text: "Are you sure you want to permanently remove this customer?", icon: 'warning',
                showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', confirmButtonText: 'Yes, delete!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        let index = customer_db.findIndex(customer => customer.customer_id === customer_id);
                        customer_db.splice(index, 1);
                        $("#customer_btns>button[type='button']").eq(3).click();
                        loadCustomerData();
                        Swal.fire({width: '225px', position: 'center', icon: 'success', title: 'Deleted!', showConfirmButton: false, timer: 2000});
                    }
                });
            } else { toastr.error('This ID is not exist!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"});}
        } else { toastr.error('Invalid customer ID format!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"});}
    }else{ toastr.error('Customer ID can not be empty!','Oops...', {"closeButton": true, "progressBar": true, "positionClass": "toast-top-center", "timeOut": "2500"});}
});

// reset form
$("#customer_btns>button[type='button']").eq(3).on("click", () => {
    $("#customer_name").val("");
    $("#customer_address").val("");
    $("#customer_salary").val("");
    $('#customer_search_tbl_body').empty();
    customer_db.sort((a, b) => a.customer_id.localeCompare(b.customer_id));
    if (customer_db.length === 0) { $("#customer_id").val("C-0001"); }
    else{
        const last = customer_db[customer_db.length - 1];
        const lastIdNumber = parseInt(last.customer_id.slice(2), 10);
        const nextIdNumber = lastIdNumber + 1;
        const nextId = `C-${nextIdNumber.toString().padStart(4, '0')}`;
        $("#customer_id").val(nextId);
    }
});

