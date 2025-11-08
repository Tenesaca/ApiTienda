import mongoose from 'mongoose';

let isConected = false;
const conectarAMongoDB = async () => {
    if(isConected){
        console.log('Ya esta conectada a MongoDB'.green);
        return;
        }
    try {
        await mongoose.connect(process.env.MONGO_URI);
        isConected = true;
        console.log('Conectado a MongoDB'.green); 
    } catch (error) {
        console.log('Hubo un error al conectar en MongoDB'.red)
    }
}
const db = mongoose.connection;

db.on('error', (error)=>{
    console.log('Error al conectar con MongoDB'.red);
});

db.once('open',()=>{
    isConected = true; 
}) 

db.on('disconected',()=>{
    isConected = false;
    console.log('desconectado de MongoDB'.yellow);  
})

process.on('SIGINT', async ()=>{
    await mongoose.connection.close();
    console.log('MongoDB desconectado'.yellow);
    process.exit(0);
})

export{conectarAMongoDB, isConected};