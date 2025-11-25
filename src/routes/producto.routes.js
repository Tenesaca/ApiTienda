import { Router } from "express";
import {
    getAllProductos,
    getProductoById,
    postProducto,
    putProducto,
    deleteProducto
} from "../controllers/producto.controller.js";

const producto = Router();

producto.get("/", getAllProductos);
producto.get("/:id", getProductoById);
producto.post("/", postProducto);
producto.put("/:id", putProducto);
producto.delete("/:id", deleteProducto);

export default producto;
