import { Request, Response } from "express";
import knex from '../databases/connection';

export default class PointsController {

  async create(req: Request, res: Response) {
    const { name, email, whatsapp, latitude, longitute, city, uf, items } = req.body;

    //const trx = await knex.transaction();
    //'https://images.unsplash.com/photo-1573481078935-b9605167e06b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60'
    const point = {
      image: req.file.filename,
      name,
      email,
      whatsapp,
      latitude: Number(String(latitude)),
      longitute: Number(String(longitute)),
      city,
      uf
    }

    const insertedIds = await knex('points').insert(point);

    const pointItems = items.split(',')
      .map((item: string) => Number(item.trim()))
      .map((item_id: number) => {
        return {
          item_id,
          point_id: insertedIds[0]
        }
      })


    try {
      await knex('point_items').insert(pointItems);
      console.log('Item dos pontos inseridos');
    } catch (err) {
      console.log(err);
    }


    //await trx.commit();

    return res.json({
      id: insertedIds[0],
      ...point,
    });
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;

    const point = await knex('points').where('id', id).first()

    if (!point) {
      return res.status(400).json({ message: 'Ponto de coleta não encontrado' });
    }

    const serializedPoint = {
      ...point,
      image_url: `http://192.168.100.4:3333/uploads/${point.image}`
    };

    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title');



    return res.json({
      point: serializedPoint, items
    });
  }

  async index(req: Request, res: Response) {
    const { city, uf, items } = req.query;

    const parsedItems = String(items)
      .split(',')
      .map(item => Number(item.trim()));

    const points = await knex('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', parsedItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*')


    const serializedPoints = points.map(point => {
      return {
        ...point,
        image_url: `http://192.168.100.4:3333/uploads/${point.image}`
      }
    })

    return res.json(serializedPoints);
  }
}