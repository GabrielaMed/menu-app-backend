import { Request, Response } from 'express';
import { AppError } from '../../middlewares/AppErrors';
import { prisma } from '../../database/prismaClient';

export class CreateTableController {
  async handle(req: Request, res: Response) {
    try {
      const { tableQuantity, companyId } = req.body;
      const tables = [];

      const existingTablesCount = await prisma.table_qr_code.count();

      for (
        let i = existingTablesCount + 1;
        i <= existingTablesCount + Number(tableQuantity);
        i++
      ) {
        const response = await prisma.table_qr_code.create({
          data: {
            tableNumber: i,
            tableLink: `https://menu-app-gm.netlify.app/${companyId}/${i}`,
            companyId
          },
        });
        tables.push(response);
      }

      if (tables.length < 1) {
        return res.status(400).send('0 tables created.');
      }

      return res.status(201).json({
        status: 'Created Successfully',
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

export const createTableController = new CreateTableController();
