'use strict';

class MaxAttemptsError extends Error {
    constructor(message) {
        super();

        if (message instanceof Error) {
            this.originalError = message;
            message = message.message;
        } else {
            this.originalError = new Error(message);
            this.originalError.stack = this.stack;
        }

        this.name = this.constructor.name;
        this.message = message;
    }
}

module.exports = MaxAttemptsError;
