import session from "express-session";

import dotenv from "dotenv";

dotenv.config();

const {
    SESSION_SECRET
} = process.env;

const sessionConfig = session({
    secret: SESSION_SECRET!,
    resave: false,

    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 3600 // 1 hour 
    }
});

export default sessionConfig;
