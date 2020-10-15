var btn = $('#top__button');

$(window).scroll(function () {
  if ($(window).scrollTop() > 2500) {
    btn.addClass('show');
  } else {
    btn.removeClass('show');
  }
});

btn.on('click', function (e) {
  e.preventDefault();
  $('html, body').animate({ scrollTop: 0 }, '300');
});
