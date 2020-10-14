$(document).ready(function () {
  $('.slider-one').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    asNavFor: '.slider-two',
  });
  $('.slider-two').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    asNavFor: '.slider-one',
    arrows: false,
    dots: true,
  });
});
