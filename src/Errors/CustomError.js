export class CustomError extends Error {
    constructor(message, code, name) {
        super(message, code, name); // (1)
        this.name = name; // (2)
        this.code = code;
    }
}