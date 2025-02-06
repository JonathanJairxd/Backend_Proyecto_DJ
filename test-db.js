import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
    try {
        console.log('🔍 Intentando conectar a MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI_PRODUCTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Conexión exitosa a MongoDB Atlas');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error);
        process.exit(1);
    }
}

testConnection();
