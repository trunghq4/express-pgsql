import express, { Request, Response } from "express";
import { Product, ProductModel } from "../models/productModel";

const model = new ProductModel();

const index = async (rq: Request, res: Response) => {
    const products = await model.index();
    res.json(products);
}

const create = async (rq: Request, res: Response) => {
    const {name, price, category} = rq.body;
    if(!name || !price){
        res.status(400);
        res.send('Missing data')
    }
    const prod = {name, price, category};
    const newProd = await model.create(prod);
    res.json(newProd);
}

const show = async (rq: Request, res: Response) => {
    const prodId: number = parseInt(rq.params.id);
    const prod: Product = await model.show(prodId);

    res.json(prod);

}

const productRoutes = (app: express.Application) => {
    app.get('/products', index);
    app.post('/products', create);
    app.get('/products/:id/details', show);
}

export default productRoutes;