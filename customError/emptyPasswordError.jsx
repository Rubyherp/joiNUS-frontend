
class EmptyPasswordError extends Error {
    constructor(message = 'Enter A Password!', code = 'INVALID_PASSWORD') {
        super(message);

        this.name = this.constructor.name;
        this.code = code;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default EmptyPasswordError;
