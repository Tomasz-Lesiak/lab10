export const config = {
    port: process.env.PORT || 3100,
    supportedDevicesNum: 17,
    JwtSecret: process.env.JWT_SECRET || 'defaultSecretKey',
    databaseUrl: process.env.MONGODB_URI || 
};
