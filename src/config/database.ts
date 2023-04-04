import mongoose from "mongoose";

class Database {
    private static mongoDBOnline = false;

    static async start() {
        await this.connectMongoDB();
    }

    private static async connectMongoDB() {
        try {
            mongoose.connection.on('connected', () => {
                this.mongoDBOnline = true;
            });
            mongoose.connection.on('disconnected', () => {
                this.mongoDBOnline = false;
                console.warn('MongoDB Disconnected');
            });
            mongoose.connection.on('reconnect', () => {
                this.mongoDBOnline = true;
                console.warn('Reconnected');
            });
            mongoose.connection.on('error', err => {
                console.error('[database connectMongoDB error] Could not connect to mongoDB, exiting process...', err);
                process.exit(1);
            });
            await mongoose.connect(process.env.DATABASE_MONGODB!);
        } catch (error) {
            console.error('[database connectMongoDB error]', error);
        }
    }

    static isConnected() {
        return this.mongoDBOnline;
    }

    static getMongoDBStatus() {
        return this.mongoDBOnline ? 'Online' : 'Offline';
    }
}

export default Database;