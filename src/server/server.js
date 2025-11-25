import express from 'express';
import cors from 'cors';
import path from "path";
import indexRoutes from '../routes/index.routes.js';
import * as db from '../db/cnn_mondodb.js';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.generalRoute = '/api';
        
        this.conectarDBMongo();
        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

    async conectarDBMongo(){
        if (!db.isConected){
            await db.conectarAMongoDB();
        }
    }

    middlewares() {
        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());

        // Directorio público
        this.app.use(express.static('public'));
    }

   routes() {
    //localhost:3000/api/ejemplo
    this.app.use(this.generalRoute, indexRoutes);
    this.app.use((req, res)=>{
        res.status(404).json({
            msg: 'Ruta no encontrada'
        })
    })
}

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', `${this.port}`.yellow);
        });
    }
}