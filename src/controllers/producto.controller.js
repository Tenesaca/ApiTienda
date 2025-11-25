import Producto from "../models/producto.model.js";
import mongoose from "mongoose";

// Obtener todos los productos
export const getAllProductos = async (req, res) => {
    console.log("Obteniendo todos los productos");
    try {
        const productos = await Producto.find({}, { __v: 0 });
        if (productos.length === 0) {
            return res.status(404).json({ msg: "No se encontraron productos" });
        }
        res.status(200).json({ productos });
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener los productos" });
    }
};

// Obtener producto por ID
export const getProductoById = async (req, res) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "El ID no es válido" });
    }

    try {
        const producto = await Producto.findById(id);
        if (!producto) {
            return res.status(404).json({ msg: "Producto no encontrado" });
        }
        res.status(200).json({ producto });
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener el producto" });
    }
};

// Crear nuevo producto
export const postProducto = async (req, res) => {
    const producto = new Producto(req.body);

    try {
        await producto.save();
        res.status(201).json({
            msg: "Producto guardado correctamente",
            producto
        });
    } catch (error) {
        res.status(400).json({
            msg: "Error al guardar el producto",
            error: error.message
        });
    }
};

// Actualizar producto
export const putProducto = async (req, res) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "El ID no es válido" });
    }

    try {
        const producto = await Producto.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });

        if (!producto) {
            return res.status(404).json({ msg: "Producto no encontrado" });
        }

        res.status(200).json({
            msg: "Producto actualizado correctamente",
            producto
        });
    } catch (error) {
        res.status(500).json({ msg: "Error al actualizar el producto" });
    }
};

// Eliminar producto
export const deleteProducto = async (req, res) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "El ID no es válido" });
    }

    try {
        const producto = await Producto.findByIdAndDelete(id);
        if (!producto) {
            return res.status(404).json({ msg: "Producto no encontrado" });
        }

        res.status(200).json({
            msg: "Producto eliminado correctamente",
            producto
        });
    } catch (error) {
        res.status(500).json({ msg: "Error al eliminar el producto" });
    }
};
