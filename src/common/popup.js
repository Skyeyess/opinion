import constants from '../constants/content';
export default (state, obj) => {
    switch (state) {
        case 'hide':
            const popupHide = document.querySelector('.popup-modal');
            if (popupHide) {
                popupHide.remove();
            }
        break;
        case 'show':
        default:
            const popupModal = document.querySelector('.popup-modal') || document.createElement('div');
            const popupContainer = document.querySelector('.popup-container') || document.createElement('div');
            const popupHeader = document.querySelector('.popup-header') || document.createElement('div');
            const popupClose = document.querySelector('.popup-close') || document.createElement('img');
            const popupContent = document.querySelector('.popup-content') || document.createElement('div');
            popupModal.className = 'popup-modal';
            popupContainer.className = 'popup-container';
            popupClose.className = 'popup-close';
            popupHeader.className = 'popup-header';
            popupContent.className = 'popup-content';
            popupClose.src = `${constants.prototype.imgBase}popup-close.png`
            document.body.appendChild(popupModal);
            popupModal.appendChild(popupContainer);
            popupContainer.appendChild(popupClose);
            popupContainer.appendChild(popupHeader);
            popupContainer.appendChild(popupContent);
            if (obj) {
                if (obj.title) {
                    popupHeader.innerHTML = obj.title;
                }
                if (obj.content) {
                    popupContent.innerHTML = obj.content;
                    popupContainer.style.marginTop = `-${popupContainer.offsetHeight / 2}px`;
                }
            }
            popupModal.addEventListener('click', function close(e) {
                if (e.target === popupModal) {
                    if (popupModal) {
                        popupModal.remove();
                    }
                }
            });
            popupClose.addEventListener('click', function closeX(e) {
                e.stopPropagation();
                if (popupModal) {
                    popupModal.remove();
                }
            });
            break;
    }
};
