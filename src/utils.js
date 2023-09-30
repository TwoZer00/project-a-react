export function genderToText(value) {
    switch (value) {
        case 1:
            return 'male';
        case 0:
            return 'female';
        case 2:
            return 'other';
    }
}