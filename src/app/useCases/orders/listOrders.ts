import { Request, Response } from 'express'
import { Order } from '../../models/Order'

export async function listOrders (req: Request, res: Response) {
  try {
    const orders = await Order.find()
    .sort({ createdAt: 1 }) //-1 decrescente 1 crescente referente a listagem de pedidos, mais antigo para o mais novo
    .populate('products.product'); //populate traz as informações do produto e não somente o id
    res.json(orders)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}
