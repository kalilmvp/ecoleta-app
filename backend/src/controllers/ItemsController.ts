import { Request, Response } from "express";
import knex from '../databases/connection';

export default class ItemsController {

  async index(req: Request, res: Response) {
    const items = await knex('items').select('*');

    const parsedItems = items.map(item => {
      return {
        id: item.id,
        title: item.title,
        image_url: `http://192.168.100.4:3333/uploads_items/${item.image}`
      }
    })

    return res.json(parsedItems);
  }
}