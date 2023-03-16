import { Request, Response } from 'express';
import { prisma } from '../../database/prismaClient';

class CreateProductController {
  async handle(req: Request, res: Response) {
    if (req.method !== 'POST') {
      return res.status(405).end();
    }

    const product = await this.createProduct(req, res);
    const additionals = await this.createAdditionals(req, res);

    return res.status(201).json({
      message: 'Product created successfully.',
      product: { product, additionals },
    });
  }

  async createProduct(req: Request, res: Response) {
    const { name, description, price } = req.body;

    const productExists = await prisma.product.findMany({
      where: { name },
      take: 1,
    });

    if (productExists.length) {
      return res.status(400).json({
        message: 'Product already exists.',
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
      },
    });

    return product;
  }

  async createAdditionals(req: Request, res: Response) {
    const { name, price } = req.body.additional;

    const additionalExists = await prisma.product.findMany({
      where: {
        AND: [name, price],
      },
      take: 1,
    });

    if (additionalExists.length) {
      return res.status(400).json({
        message: 'Product already exists.',
      });
    }

    const additional = await prisma.additional.create({
      data: {
        name,
        price,
      },
    });

    return additional;
  }
}

export const createProductController = new CreateProductController();
