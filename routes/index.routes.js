import { Router } from "express";
import producto from "./producto.routes.js";

const indexRoutes = Router();

// localhost:3000/api/producto
indexRoutes.use("/producto", producto);

export default indexRoutes;
