export const validator = (value, type) => {
    switch (type) {
        case 'email':
            return value && value.length > 100 && value.includes('@')
        case 'password':
            return value && value.length > 8
        default:
            return false
    }
}

export const sanitise = (value) => value && value.trim();
