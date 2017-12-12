export default (input, len) => {
    let num = 8;
    if (len && /^[0-9]*$/.test(len)) {
        num = len;
    }
    if (input) {
        let currentInput = input
        if (currentInput.includes('-')) {
            currentInput = currentInput.split('-');
        } else if (currentInput.includes('+')) {
            currentInput = currentInput.split('+');
        }
        if (/[-+]/.test(input) && input.length > num) {
            input = currentInput[currentInput.length - 1];
        } else {
            input = input.replace(/[-+]/g, '');
        }
    }
    return input;
};
