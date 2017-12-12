export default (name, state) => {
    if (name) {
        if (state) {
            // if (name.length > 2) {
            //     name = name.substr(name.length - 2, 2)
            // }
        } else {
            if (/[-_.]/.test(name)) {
                name = name.split(/[-_.]/)[1][0].toUpperCase();
            } else {
                name = name[0].toUpperCase();
            }
        }
    }
    return name;
};
