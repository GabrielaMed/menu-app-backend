import { Request, Response } from 'express';
import { AppError } from '../../middlewares/AppErrors';
import { prisma } from '../../database/prismaClient';

export class GetAdditionalInProductByIdController {
  async handle(req: Request, res: Response) {
    const { productId } = req.params;

    try {
      const product = await prisma.additional_in_Product.findMany({
        where: {
          productId,
        },
        include: {
          additional: true,
        },
      });

      if (product.length === 0) {
        return res.status(404).send('Additional not found!');
      }

      let additionalsArray: any[] = [];

      const listAdditionals = async (index: number) => {
        if (!product[index]) return;

        const additional = product[index].additional;
        // console.log(additional);
        additionalsArray.push({
          ...additional,
        });

        await listAdditionals(index + 1);
      };

      await listAdditionals(0);

      return res.status(200).json({ additionals: additionalsArray });
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

export const getAdditionalInProductByIdController =
  new GetAdditionalInProductByIdController();
