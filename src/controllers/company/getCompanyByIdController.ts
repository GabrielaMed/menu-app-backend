import { Request, Response } from 'express';
import { AppError } from '../../middlewares/AppErrors';
import { prisma } from '../../database/prismaClient';

export class GetCompanyByIdController {
  async handle(req: Request, res: Response) {
    const { companyId } = req.params;

    try {
      const company = await prisma.company.findMany({
        where: {
          id: companyId,
        },
        take: 1,
      });
      const companyPhone = company[0].phone.toString();

      const { phone, ...companyData } = company[0];

      if (!companyData) {
        return res.status(404).send('Company not found!');
      }

      return res
        .status(200)
        .json({ company: { ...companyData, phone: companyPhone } });
    } catch (error) {
      console.log(error, 'ERROR');
      if (error instanceof Error) {
        throw new AppError(error.message, 400);
      } else {
        console.log(error);
        return error;
      }
    }
  }
}
export const getCompanyByIdController = new GetCompanyByIdController();
