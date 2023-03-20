import { NextFunction, Request, Response } from 'express';
import { prisma } from '../../database/prismaClient';
import { AppError } from '../../middlewares/AppErrors';
import { getAdditionalByNameController } from './getAdditionalByNameController';

export class CreateAdditionalController {
  async createAdditionals(req: Request, res: Response, next: NextFunction) {
    try {
      let additionals: any[] = [];

      const createAdditional = async (index: number) => {
        if (!req.body.additionals[index]) return;

        const { name, price } = req.body.additionals[index];

        const additionalExists = await getAdditionalByNameController.handle(
          req,
          res,
          name,
          price
        );

        if (additionalExists) {
          return res.status(400).json({
            message: 'Additional already exists.',
          });
        }

        const additional = await prisma.additional.create({
          data: {
            name,
            price,
          },
        });

        additionals.push({
          ...additional,
        });

        await createAdditional(index + 1);
      };

      await createAdditional(0);
      res.locals.product.additionals = additionals;
      next();
    } catch (error) {
      if (error instanceof Error) {
        throw new AppError(error.message, 400);
      } else {
        console.log(error);
        return error;
      }
    }
  }
}

export const createAdditionalController = new CreateAdditionalController();
