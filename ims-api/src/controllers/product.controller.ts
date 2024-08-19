import { Request, Response } from "express";
import { Product } from "../entities/product/product.entity";
import { Category } from "../entities/category/category.entity";
import { validate } from "class-validator";
import { objToString } from "../utility/user.utils";

export const createItem = async (req: Request, res: Response) => {
  //const {name} = req.params as any;
  const { categoryId, name } = req.body as any;
  const category = await Category.findOne({ where: { id: categoryId } });
  if (!category) {
    return res.status(400).json({
      message: `category with id ${categoryId} not found`,
    });
  };
  
  console.log(req.user, "req.user");
  try {
    const product = new Product();
    product.name = name;
    product.category = categoryId;
    product.addedBy = req.currentUser!.id;
    validate(product).then(async (errors) => {
      if (errors.length > 0) {
        const { constraints } = errors[0];
        res.status(422).json({
          message: objToString(constraints),
        });
      } else {
        await product.save();
        res.status(201).json({
          message: "Product added successfully",
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "item creation failed",
      err: error,
    });
  }
};
export const deleteItem = async (req: Request, res: Response) => {
  const { productId } = req.params as any;
  const product = await Product.findOne({ 
    where: { 
      id: productId 
    } 
  });
  if (!product) {
    return res.status(400).json({
      message: `No product found`,
    });
  }
  try {
    product.remove();
    res.status(201).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Product deletion failed",
      err: error,
    });
  }
};
export const updateItem = async (req: Request, res: Response) => {
  const { id } = req.params as any;
  const { categoryId, newname, quantity } = req.body as any;
  const product = await Product.findOne({ where: { id } });
  const category = await Category.findOne({ where: { id: categoryId } });
  if (!product) {
    return res.status(400).json({
      message: `Product with ID ${id} not found`,
    });
  }
  if (!category) {
    return res.status(400).json({
      message: `category with ID: ${categoryId} not found`,
    });
  }
  try {
    product.name = newname;
    product.category = categoryId;
    product.quantity = parseInt(quantity);
    await product.save();
    res.status(201).json({
      message: "Product updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Product update failed",
      err: error,
    });
  }
};
export const searchItem = async (req: Request, res: Response) => {
  const { name } = req.params as any;
  const product = await Product.find({ where: { name } });
  if (!product) {
    return res.status(400).json({
      message: `item with name ${name} not found`,
    });
  }
  try {
    res.status(201).json({
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "item creation failed",
      err: error,
    });
  }
};
export const SearchItemById = async (req: Request, res: Response) => {
  const { id } = req.params as any;
  const product = await Product.findOne({
    where: { id },
    relations: { category: true },
    loadRelationIds: true,
  });
  if (!product) {
    return res.status(400).json({
      message: `Product with this id ${id} not found`,
    });
  }
  try {
    res.status(201).json({
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "  Failed to search for Product by id",
      err: error,
    });
  }
};
export const deleteItembyid = async (req: Request, res: Response) => {
  const { id } = req.params as any;
  const product = await Product.findOne({
    where: { id },
    relations: { category: true },
    loadRelationIds: true,
  });
  if (!product) {
    return res.status(400).json({
      message: `item with id ${id} not found`,
    });
  }
  if(product)
  try {
    {
      product.remove();
      return res.status(400).json({
        message: `Product deleted successfully`,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Product delete failed",
      err: error,
    });
  }
};
export const updateCategorybyItem = async (req: Request, res: Response) => {
  const { name, categoryId } = req.params as any;
  const product = await Product.findOne({ where: { name } });
  if (!product) {
    return res.status(400).json({
      message: `Product with name ${name} not found`,
    });
  }
  const category = await Category.findOne({ where: { id: categoryId } });
  if (!category) {
    return res.status(400).json({
      message: `category with id ${categoryId} not found`,
    });
  }
  try {
    product.name = name;
    product.category = category;
    await product.save();
    res.status(201).json({
      message: "Product update successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Product update failed",
      err: error,
    });
  }
};
export const getAllItem = async (req: Request, res: Response) => {
  const product = await Product.find({ relations: { category: true } });
  // if (!product) {
  //   return res.status(400).json({
  //     message: `not found any item`,
  //   });
  // }
  try {
    res.status(201).json({
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "  Failed to search for products",
      err: error,
    });
  }
};
