import { Request, Response } from 'express';
import { AppError } from '../../middlewares/AppErrors';
import { prisma } from '../../database/prismaClient';

export class GetOrdersByCompanyIdController {
  async handle(req: Request, res: Response) {
    const { companyId } = req.params;

    try {
      const ordersId = await prisma.order_in_orders_card.findMany({
        where: {
          orders_card: {
            companyId: {
              equals: companyId,
            },
          },
        },
        select: {
          orderId: true,
        },
      });
      const orderIds = ordersId.map((order) => order.orderId);

      const orders = await prisma.order.findMany({
        where: {
          id: {
            in: orderIds,
          },
        },
        select: {
          id: true,
          dateTimeOrder: true,
          total: true,
          orderNumber: true,
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
          order_status: {
            select: {
              status: true,
            },
          },
          Order_in_orders_card: {
            select: {
              orders_card: {
                select: {
                  tableNumber: true,
                  dateTime: true,
                  orders_card_status: {
                    select: {
                      status: true,
                    },
                  },
                },
              },
            },
          },
          _count: true,
        },
      });

      const ordersParsed = orders.map((order) => {
        const orderInOrdersCard = order.Order_in_orders_card[0];
        return {
          ...order,
          statusOrder: order.order_status.status,
          tableNumber: orderInOrdersCard?.orders_card.tableNumber || null,
          Order_products: [
            ...order.Order_products.map((item) => ({
              id: item.id,
              product: item.product,
              observation: item.observation,
              quantity: item.quantity,
              additionals: [
                ...item.Order_additional.map((item) => ({
                  ...item.additional,
                  quantity: item.quantity,
                })),
              ],
            })),
          ],
          Order_card: [
            ...order.Order_in_orders_card.map((item) => ({
              dateTime: item.orders_card.dateTime,
              order_card_status: item.orders_card.orders_card_status.status,
              tableNumber: item.orders_card.tableNumber,
            })),
          ],
        };
      });

      return res.status(200).json(ordersParsed);
    } catch (error) {
      console.log('>>>', error);

      if (error instanceof Error) {
        throw new AppError(error.message, 400);
      } else {
        console.log(error);
        return error;
      }
    }
  }
}

export const getOrdersByCompanyIdController =
  new GetOrdersByCompanyIdController();
