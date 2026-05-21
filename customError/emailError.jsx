class EmailError extends Error {
    constructor(message = 'Format: exxxxxxx@u.nus.edu', code = 'INVALID_EMAIL_FORMAT') {
        super(message);

        this.name = this.constructor.name;
        this.code = code;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default EmailError;
