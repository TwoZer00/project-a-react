export class CustomError extends Error {
    constructor(message) {
        super(message); // (1)
        this.name = "NoUserFounded"; // (2)
        this.code = 101;
    }
}