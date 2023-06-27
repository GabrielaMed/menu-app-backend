import { Request, Response } from 'express';
import { AppError } from '../../middlewares/AppErrors';
import { prisma } from '../../database/prismaClient';

export class GetTablesByCompanyController {
  async handle(req: Request, res: Response) {
    try {
      const { companyId } = req.body;

      const tables = await prisma.table_qr_code.findMany({
        where: companyId,
        select: {
          tableNumber: true,
          tableLink: true,
        },
      });

      return res.status(200).json({
        tables,
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

export const getTablesByCompanyController = new GetTablesByCompanyController();
