import session from "express-session";
import dotenv from "dotenv";

dotenv.config();

const {
    SESSION_SECRET
} = process.env;

const sessionConfig = session({
    secret: SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    }
});

export default sessionConfig;
