(() => {
  const menuBtnRef = document.querySelector('[data-menu-button]');
  const mobileMenuRef = document.querySelector('[data-menu]');

  menuBtnRef.addEventListener('click', () => {
    const expanded =
      menuBtnRef.getAttribute('aria-expanded') === 'true' || false;

    menuBtnRef.classList.toggle('is-open');
    menuBtnRef.getAttribute('aria-expanded', !expanded);

    mobileMenuRef.classList.toggle('is-open');
  });
})();

// $(document).mouseup(function (e) {
//   var container = $('#burger');
//   if (container.has(e.target).length === 0) {
//     container.hide();
//   }
// });

// var menu = document.getElementsByClassName('#burger')[0];

// // Menu Close
// function menuClose() {
//   menu.classList.remove('.is-open');
// }

// // Menu Close Click Outside
// function menuCloseClickOutside(e) {
//   if (!e.target.matches('#burger, #burger *')) {
//     menuClose();
//   }
// }

// document.addEventListener('click', menuCloseClickOutside);
// document.addEventListener('touchstart', menuCloseClickOutside);
