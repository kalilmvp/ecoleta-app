import express from 'express';
import multer from 'multer'
import { celebrate, Joi, Segments } from 'celebrate';
import ItemsController from './controllers/ItemsController';
import PointsController from './controllers/PointsController';
import multerConfig from './config/multer';

const routes = express.Router();
const pointsController = new PointsController();
const itemsController = new ItemsController();
const upload = multer(multerConfig);

// items
routes.get('/items', itemsController.index);

// points
routes.get('/points/:id', pointsController.show);
routes.get('/points/', pointsController.index);

routes.post('/points', upload.single('image'),
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required().email(),
      whatsapp: Joi.number().required(),
      latitude: Joi.number().required(),
      longitute: Joi.number().required(),
      uf: Joi.string().required().max(2),
      city: Joi.string().required(),
      items: Joi.string().required()
    })
  }, { abortEarly: false }), pointsController.create);

export default routes;