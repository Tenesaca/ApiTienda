import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, "El nombre del producto es obligatorio"]
    },
    descripcion: {
        type: String,
        required: [true, "La descripción es obligatoria"]
    },
    precio: {
        type: Number,
        required: [true, "El precio es obligatorio"],
        min: [0, "El precio no puede ser negativo"]
    },
    stock: {
        type: Number,
        default: 0
    },
    categoria: {
        type: String,
        required: false
    },
    disponible: {
        type: Boolean,
        default: true
    }
});

const Producto = mongoose.model("Producto", productoSchema);

export default Producto;
