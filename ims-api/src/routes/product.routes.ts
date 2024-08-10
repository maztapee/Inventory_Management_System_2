import { Router } from "express";
import {
  createItem,
  updateItem,
  deleteItem,
  searchItem,
  SearchItemById,
  deleteItembyid,
  getAllItem,updateCategorybyItem
} from "../controllers/product.controller";
export const ProductRouter: Router = Router({
  strict: true,
});
ProductRouter.post("/", createItem);
ProductRouter.put("/:name", updateItem);
ProductRouter.delete("/", deleteItem);
ProductRouter.get("/:id", SearchItemById);
ProductRouter.delete("/:id", deleteItembyid);
ProductRouter.get("/", getAllItem);





