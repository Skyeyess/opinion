import constants from '../constants/content';
export default {
  update: function(el, binding) {
    if (!document.getElementById(el.id)) return;
    const bottomNav = document.querySelectorAll('.bottom_tabs .mint-tab-item .mint-tab-item-icon')[binding.value.menu];
    const backIcon = document.querySelectorAll('.back-top')[binding.value.menu];
    if (el.scrollTop > constants.prototype.rocketShow) {
        bottomNav.style.marginTop = -60 + 'px';
        backIcon.style.top = 35 + 'px';
    } else {
        bottomNav.style.marginTop = 0;
        backIcon.style.top = 56 + 'px';
    }
  }
};
