$('#customer_main_section').css('display', 'none');
$('#item_main_section').css('display', 'none');
$('#order_main_section').css('display', 'none');

$('#brand').on('click', () => {
    $('#home_section').css('display', 'block');
    $('#customer_main_section').css('display', 'none');
    $('#item_main_section').css('display', 'none');
    $('#order_main_section').css('display', 'none');
});
$('#home_nav').on('click', () => {
    $('#home_section').css('display', 'block');
    $('#customer_main_section').css('display', 'none');
    $('#item_main_section').css('display', 'none');
    $('#order_main_section').css('display', 'none');
});
$('#customer_nav').on('click', () => {
    $('#home_section').css('display', 'none');
    $('#customer_main_section').css('display', 'block');
    $('#item_main_section').css('display', 'none');
    $('#order_main_section').css('display', 'none');
});
$('#item_nav').on('click', () => {
    $('#home_section').css('display', 'none');
    $('#customer_main_section').css('display', 'none');
    $('#item_main_section').css('display', 'block');
    $('#order_main_section').css('display', 'none');
});
$('#order_nav').on('click', () => {
    $('#home_section').css('display', 'none');
    $('#customer_main_section').css('display', 'none');
    $('#item_main_section').css('display', 'none');
    $('#order_main_section').css('display', 'block');
});
$('#customer_nav_btn').on('click', () => {
    $('#home_section').css('display', 'none');
    $('#customer_main_section').css('display', 'block');
    $('#item_main_section').css('display', 'none');
    $('#order_main_section').css('display', 'none');
});
$('#item_nav_btn').on('click', () => {
    $('#home_section').css('display', 'none');
    $('#customer_main_section').css('display', 'none');
    $('#item_main_section').css('display', 'block');
    $('#order_main_section').css('display', 'none');
});
$('#order_nav_btn').on('click', () => {
    $('#home_section').css('display', 'none');
    $('#customer_main_section').css('display', 'none');
    $('#item_main_section').css('display', 'none');
    $('#order_main_section').css('display', 'block');
});