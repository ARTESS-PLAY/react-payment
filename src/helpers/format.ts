export const numberWithSpaces = (x: number | string) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export const getRandomString = (length: number) => {
    let randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for ( let i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result
}
