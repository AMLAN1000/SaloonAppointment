import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    env: process.env.NODE_ENV,
    stripe: {
        secret_key: process.env.STRIPE_SECRET_KEY,
        publishable_key: process.env.STRIPE_PUBLISHABLE_KEY,
        webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
    },
    paypal: {
        clientId: process.env.PAYPAL_CLIENT_ID as string,
        clientSecret: process.env.PAYPAL_CLIENT_SECRET as string,
        apiUrl:
            process.env.NODE_ENV === 'live'
                ? 'https://api.paypal.com'
                : 'https://api.sandbox.paypal.com',
    },
    port: process.env.PORT,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    jwt: {
        jwt_secret: process.env.JWT_SECRET,
        expires_in: process.env.EXPIRES_IN,
        refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
        refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
        reset_pass_secret: process.env.RESET_PASS_TOKEN,
        reset_pass_token_expires_in: process.env.RESET_PASS_TOKEN_EXPIRES_IN
    },

    reset_pass_link: process.env.RESET_PASS_LINK,
    emailSender: {
        email: process.env.EMAIL,
        app_pass: process.env.APP_PASS
    },

    TICKETMASTER_BASE_URL: process.env.TICKETMASTER_BASE_URL,

    TICKETMASTER_API_KEY: process.env.TICKETMASTER_API_KEY,

    AI_API_KEY: process.env.AI_API_KEY,
}


