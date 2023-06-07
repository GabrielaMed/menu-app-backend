import { NextFunction, Request, Response } from 'express';
import { prisma } from '../../database/prismaClient';
import { AppError } from '../../middlewares/AppErrors';
import { getAdditionalByNameController } from './getAdditionalByNameController';

export class CreateAdditionalController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { companyId } = req.params;
    const { name, price } = req.body;
    try {
      const additionalExists = await getAdditionalByNameController.handle(
        req,
        res,
        name,
        companyId
      );

      if (additionalExists) {
        return res.status(400).send(`Additional ${name} already exists.`);
      }

      const additional = await prisma.additional.create({
        data: {
          name,
          price,
          companyId,
        },
        select: {
          id: true,
          name: true,
          price: true,
          Additional_in_Product: {
            select: {
              product: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  price: true,
                  Image: {
                    select: {
                      fileName: true,
                      id: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      res.status(201).json({
        status: 'Created Succesfully',
        product: additional,
      });
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
