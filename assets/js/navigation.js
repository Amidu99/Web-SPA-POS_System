$('#customer_main_section').css('display', 'none');
$('#item_main_section').css('display', 'none');
$('#order_main_section').css('display', 'none');

$("#brand, #home_nav").on('click', () => {
    $('#home_section').css('display', 'block');
    $('#customer_main_section').css('display', 'none');
    $('#item_main_section').css('display', 'none');
    $('#order_main_section').css('display', 'none');
});
$("#customer_nav, #customer_nav_btn").on('click', () => {
    $('#home_section').css('display', 'none');
    $('#customer_main_section').css('display', 'block');
    $('#item_main_section').css('display', 'none');
    $('#order_main_section').css('display', 'none');
});
$("#item_nav, #item_nav_btn").on('click', () => {
    $('#home_section').css('display', 'none');
    $('#customer_main_section').css('display', 'none');
    $('#item_main_section').css('display', 'block');
    $('#order_main_section').css('display', 'none');
});
$("#order_nav, #order_nav_btn").on('click', () => {
    $('#home_section').css('display', 'none');
    $('#customer_main_section').css('display', 'none');
    $('#item_main_section').css('display', 'none');
    $('#order_main_section').css('display', 'block');
});
const imageSources = [
    './assets/images/welcome-img1.png',
    './assets/images/welcome-img2.png',
    './assets/images/welcome-img3.png',
    './assets/images/welcome-img4.png',
    './assets/images/welcome-img5.png'
];
let currentImageIndex = 0;
const rotatingImage = $('#homeImg');
function rotateImage() {
    rotatingImage.fadeOut(500, function() {
        currentImageIndex = (currentImageIndex + 1) % imageSources.length;
        rotatingImage.attr('src', imageSources[currentImageIndex]).fadeIn(500);
    });
}
setInterval(rotateImage, 2500);
AOS.init();