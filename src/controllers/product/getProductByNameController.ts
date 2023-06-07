import { Request, Response } from 'express';
import { AppError } from '../../middlewares/AppErrors';
import { prisma } from '../../database/prismaClient';

export class GetProductByNameController {
  async handle(
    req: Request,
    res: Response,
    productName: string,
    companyId: string
  ) {
    try {
      const product = await prisma.product.findMany({
        where: {
          name: productName,
          companyId,
        },
        take: 1,
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          Additional_in_Product: {
            select: {
              additional: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                },
              },
            },
          },
          Image: {
            select: {
              fileName: true,
              id: true,
            },
          },
        },
      });

      return product.length > 0 ? product[0].id : undefined;
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

export const getProductByNameController = new GetProductByNameController();
