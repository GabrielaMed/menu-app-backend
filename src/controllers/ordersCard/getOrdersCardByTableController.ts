import { NextFunction, Request, Response } from 'express';
import { prisma } from '../../database/prismaClient';
import { AppError } from '../../middlewares/AppErrors';

export class GetOrdersCardByTableController {
  async handle(req: Request, res: Response) {
    const { companyId } = req.body;
    const { tableNumber } = req.params;

    try {
      const orders_card = await prisma.orders_card.findMany({
        where: {
          companyId,
          tableNumber: Number(tableNumber),
        },
        select: {
          id: true,
          dateTime: true,
          tableNumber: true,
          orders_card_status: {
            select: {
              status: true,
            },
          },
          Order_in_orders_card: {
            select: {
              order: {
                select: {
                  dateTimeOrder: true,
                  order_status: {
                    select: {
                      status: true,
                    },
                  },
                  orderNumber: true,
                  total: true,
                  Order_products: {
                    select: {
                      id: true,
                      observation: true,
                      quantity: true,
                      Order_additional: {
                        select: {
                          additional: {
                            select: {
                              id: true,
                              name: true,
                              price: true,
                            },
                          },
                          quantity: true,
                        },
                      },
                      product: {
                        select: {
                          id: true,
                          name: true,
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
              },
            },
          },
        },
      });

      if (orders_card.length === 0) {
        return res.status(400).send('No Orders Card found!');
      }

      const ordersParsed = orders_card.map((card) => {
        const orderInCard = card.Order_in_orders_card.map((order) => ({
          ...order.order,
          statusOrder: order.order.order_status.status,
          tableNumber: card.tableNumber,
          Order_products: [
            ...order.order.Order_products.map((item) => ({
              id: item.id,
              product: item.product,
              observation: item.observation,
              quantity: item.quantity,
              additionals: [
                ...item.Order_additional.map((additional) => ({
                  ...additional.additional,
                  quantity: additional.quantity,
                })),
              ],
            })),
          ],
          Order_card: [
            {
              id: card.id,
              dateTime: card.dateTime,
              order_card_status: card.orders_card_status.status,
              tableNumber: card.tableNumber,
            },
          ],
        }));

        return orderInCard;
      });

      // console.log('HERE>>>>>>>>>>', ordersParsed);

      return res.status(200).json(ordersParsed);
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

export const getOrdersCardByTableController =
  new GetOrdersCardByTableController();
