import { Request, Response } from 'express';
import { AppError } from '../../middlewares/AppErrors';
import { prisma } from '../../database/prismaClient';

export class RelatesAdditionalProductController {
  async handle(req: Request, res: Response) {
    try {
      let { id } = res.locals.product;
      let product_id = id;
      const relatesProductAdditional = async (index: number) => {
        if (!res.locals.product.additionals[index]) return;

        const { id } = res.locals.product.additionals[index];

        await prisma.additional_in_Product.create({
          data: {
            additionalId: id,
            productId: product_id,
          },
        });

        await relatesProductAdditional(index + 1);
      };

      await relatesProductAdditional(0);

      res.status(201).json({
        status: 'Created Succesfully',
        product: res.locals.product,
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

export const relatesAdditionalProductController =
  new RelatesAdditionalProductController();
