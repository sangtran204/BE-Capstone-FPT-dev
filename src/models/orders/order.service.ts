// import { AccountEntity } from 'models/accounts/entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { OrderEntity } from './entities/order.entity';
import { DataSource, EntityManager, Like, Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import {
  OrderFilterDTO,
  OrderGetByKitchen,
  OrderSearchByDate,
  PreFoodByWeek,
} from './dto/order-filter.dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { OrderCreationDTO } from './dto/create-order.dto';
import { AccountEntity } from '../accounts/entities/account.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { FirebaseMessageService } from 'src/providers/firebase/message/firebase-message.service';
import { SubscriptionService } from '../subscriptions/subscriptions.service';
import { PackageItemService } from '../package-item/package-item.service';
import { FoodsService } from '../foods/foods.service';
import { StationsService } from '../stations/stations.service';
import { KitchenService } from '../kitchens/kitchens.service';
import { TimeSlotsService } from '../time-slots/time-slots.service';
import { FoodByKitchenDTO } from '../foods/dto/foodByKitchen.dto';
import { OrderEnum } from 'src/common/enums/order.enum';
import { OrderDetailRes } from './dto/order-detail-res';

// import { OrderTourCreationDto } from './dto/order-tour-creation.dto';
// import { TourGuidesService } from 'models/tour-guides/tour-guides.service';
// import { FirebaseMessageService } from 'providers/firebase/message/firebase-message.service';
// import { ToursService } from 'models/tours/tours.service';
// import { TourPlansService } from 'models/tour-plans/tour-plans.service';
// import { NotificationsService } from '../notifications/notifications.service';
// import { RoleEnum } from '../../common/enums/role.enum';
// import { InjectMapper } from '@automapper/nestjs';
// import { VnpayService } from '../../providers/vnpay/vnpay.service';
// import { VnpayDto } from '../../providers/vnpay/vnpay.dto';
// import { BanksService } from '../banks/banks.service';
// import { PaymentsService } from '../payments/payments.service';
// import { Cron, CronExpression, Interval } from '@nestjs/schedule';
// import { OrderFilter, OrderFilterMe } from './dto/order-filter.dto';
// import { TypeNotificationEnum } from '../../common/enums/type-notification.enum';
// import { CommissionsService } from '../commissions/commissions.service';
@Injectable()
export class OrdersService extends BaseService<OrderEntity> {
  private readonly logger = new Logger(OrdersService.name);
  constructor(
    @InjectRepository(OrderEntity)
    private readonly ordersRepository: Repository<OrderEntity>,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly subscriptionService: SubscriptionService,
    private readonly packageItemService: PackageItemService,
    private readonly foodsService: FoodsService,
    private readonly stationService: StationsService,
    private readonly kitchenService: KitchenService,
    private readonly timeSlotService: TimeSlotsService,
    private readonly dataSource: DataSource,
    private readonly notificationsService: NotificationsService,
    private readonly firebaseMessageService: FirebaseMessageService, // private readonly firebaseMessageService: FirebaseMessageService, // private readonly tourService: ToursService, // private readonly tourPlanService: TourPlansService, // private readonly notificationsService: NotificationsService,  // private readonly dataSource: DataSource, // private readonly vnpayService: VnpayService, // private readonly banksService: BanksService, // private readonly paymentsService: PaymentsService, // private readonly commissionsService: CommissionsService, // private readonly firebaseMessage: FirebaseMessageService,
  ) {
    super(ordersRepository);
  }

  // async findAll(orderFilter: OrderFilter): Promise<[OrderDTO[], number]> {
  //   const { currentPage, endDate, sizePage, sort, startDate } = orderFilter;
  //   if (!startDate && !endDate) {
  //     const [list, count] = await this.ordersRepository.findAndCount({
  //       relations: {
  //         customer: { account: { profile: true } },
  //         packages: true,
  //         //   payment: true,
  //       },
  //       skip: sizePage * (currentPage - 1),
  //       take: sizePage,
  //       order: { startDelivery: sort === SortEnum.ASCENDING ? 'ASC' : 'DESC' },
  //     });
  //     return [this.mapper.mapArray(list, OrderEntity, OrderDTO), count];
  //   } else {
  //     const [list, count] = await this.ordersRepository.findAndCount({
  //       relations: {
  //         customer: { account: { profile: true } },
  //         packages: true,
  //         //   payment: true,
  //       },
  //       where: {
  //         startDelivery:
  //           startDate && !endDate
  //             ? Like(startDate)
  //             : !startDate && endDate
  //             ? Like(endDate)
  //             : Between(startDate, endDate),
  //       },
  //       skip: sizePage * (currentPage - 1),
  //       take: sizePage,
  //       order: { startDelivery: sort === SortEnum.ASCENDING ? 'ASC' : 'DESC' },
  //     });
  //     return [this.mapper.mapArray(list, OrderEntity, OrderDTO), count];
  //   }
  // }

  async orderSub(
    dto: OrderCreationDTO,
    user: AccountEntity,
  ): Promise<OrderEntity> {
    const subFind = await this.subscriptionService.findOne({
      where: { id: dto.subscriptionID },
    });
    if (!Boolean(subFind))
      throw new HttpException('Sub not Found', HttpStatus.BAD_REQUEST);

    const packageItem = await this.packageItemService.findOne({
      where: { id: dto.packageItemID },
    });

    if (!Boolean(packageItem)) {
      throw new HttpException('PackageItem  not found', HttpStatus.BAD_REQUEST);
    }

    const foodFind = await this.foodsService.findOne({
      where: { id: dto.foodID },
    });

    if (!Boolean(foodFind)) {
      throw new HttpException('food not found', HttpStatus.BAD_REQUEST);
    }

    const slotFind = await this.timeSlotService.findOne({
      where: { id: dto.timeSlotID },
    });

    if (!Boolean(slotFind)) {
      throw new HttpException('Slot not found', HttpStatus.BAD_REQUEST);
    }

    const stationFind = await this.stationService.findOne({
      where: { id: dto.stationID },
    });

    if (!Boolean(stationFind)) {
      throw new HttpException('Station  not found', HttpStatus.BAD_REQUEST);
    }
    const kitchenFind = await this.kitchenService.findOne({
      where: { stations: { id: dto.stationID } },
    });
    if (!Boolean(kitchenFind)) {
      throw new HttpException('Kitchen not found', HttpStatus.BAD_REQUEST);
    }

    let order: OrderEntity;
    const callback = async (entityManager: EntityManager): Promise<void> => {
      try {
        order = await entityManager.save(
          entityManager.create(OrderEntity, {
            // commission: commission[0],
            deliveryDate: dto.deliveryDate,
            priceFood: dto.priceFood,
            nameFood: dto.nameFood,
            subscription: subFind,
            packageItem: packageItem,
            food: foodFind,
            station: stationFind,
            timeSlot: slotFind,
            kitchen: kitchenFind,
          }),
        );
      } catch (error) {
        console.error(error);
        throw new HttpException(
          'cannot order this sub',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // if (Boolean(order)) {
      //   const title = `You was booked by ${user.profile.fullName}`;
      //   const body = `Food ${foodFind.name}`;
      //   const data = { ['idOrder']: order.id };
      //   const saveNotify = this.notificationsService.save({
      //     account: { id: user.id },
      //     title,
      //     body,
      //     data: JSON.stringify(data),
      //     type: TypeNotificationEnum.ORDER,
      //   });
      //   const sendNotify = this.firebaseMessageService.sendCustomNotification(
      //     customer.account.deviceToken,
      //     title,
      //     body,
      //     data,
      //   );
      //   await saveNotify;
      //   await sendNotify;
      // }
    };
    await this.transaction(callback, this.dataSource);

    return await this.findById(order.id);
  }

  async getOrderDetail(id: string): Promise<OrderDetailRes> {
    const order = await this.ordersRepository
      .createQueryBuilder('orders')
      .select(
        'orders.id, orders.nameFood, orders.createdAt as orderDate,  time_slots.startTime, time_slots.endTime, stations.name as station, accounts.phone, profiles.fullName, orders.deliveryDate',
      )
      .leftJoin('orders.subscription', 'subscriptions')
      .leftJoin('subscriptions.customer', 'customers')
      .leftJoin('customers.account', 'accounts')
      .leftJoin('accounts.profile', 'profiles')
      .leftJoin('orders.timeSlot', 'time_slots')
      .leftJoin('orders.station', 'stations')
      .where('orders.id = :id', { id: id })
      .getRawOne();

    if (!order) {
      throw new HttpException('Can not get order detail', HttpStatus.NOT_FOUND);
    }
    return order;
  }

  async findById(id: string): Promise<OrderEntity> {
    const order = await this.findOne({
      where: { id: id },
      relations: {
        subscription: { customer: { account: { profile: true } } },
        // food: true,
        station: true,
        packageItem: true,
        kitchen: true,
        timeSlot: true,
      },
    });
    if (!order)
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    return order;
  }

  async getOrderByKitchen(
    // user: AccountEntity,
    find: OrderGetByKitchen,
  ): Promise<OrderEntity[]> {
    const listOrder = await this.ordersRepository.find({
      where: {
        kitchen: { id: find.kitchenId },
        deliveryDate: find.deliveryDate,
        station: { id: find.stationId },
        timeSlot: { id: find.time_slotId },
        status: OrderEnum.PROGRESS,
      },
      relations: {
        kitchen: { account: { profile: true } },
        station: true,
        subscription: { customer: { account: { profile: true } } },
        timeSlot: true,
      },
    });
    if (!listOrder || listOrder.length == 0) {
      throw new HttpException('No order found', HttpStatus.NOT_FOUND);
    } else {
      return listOrder;
    }
  }

  // async getOrderByKitchen(data: OrderSearchByDate): Promise<OrderEntity[]> {
  //   const list = await this.ordersRepository.find({
  //     relations: {
  //       timeSlot: true,
  //       subscription: { customer: { account: { profile: true } } },
  //       food: true,
  //     },
  //     where: {
  //       deliveryDate: data.deliveryDate,
  //     },
  //   });
  //   return list;
  // }

  async getFoodByKitchen(
    user: AccountEntity,
    data: OrderSearchByDate,
  ): Promise<FoodByKitchenDTO[]> {
    const list = await this.ordersRepository
      .createQueryBuilder('orders')
      .select(
        'foodId, nameFood, time_slots.flag as flag, count(foodId) as quantity, foods.image',
      )
      // .from('foods', 'foods')
      // .leftJoinAndSelect('orders.foods', 'foods')
      .leftJoin('orders.food', 'foods')
      .leftJoin('orders.timeSlot', 'time_slots')
      .where('orders.kitchenId = :kitchenId', { kitchenId: user.id })
      .andWhere('orders.deliveryDate = :deliveryDate', {
        deliveryDate: data.deliveryDate,
      })
      .groupBy('foodId, nameFood, timeSlotId, foods.image')
      .execute();
    // const list = await this.ordersRepository.findAndCountBy
    if (!list || list.length == 0) {
      throw new HttpException('No food found', HttpStatus.NOT_FOUND);
    } else {
      return list;
    }
  }

  async getPreFoodByWeek(
    user: AccountEntity,
    data: PreFoodByWeek,
  ): Promise<FoodByKitchenDTO[]> {
    // const dateFilter: Article
    const list = await this.ordersRepository
      .createQueryBuilder('orders')
      .select(
        'foodId, nameFood, foods.description, count(foodId) as quantity, deliveryDate, foods.image',
      )
      .leftJoin('orders.food', 'foods')
      .where('orders.kitchenId = :kitchenId', { kitchenId: user.id })
      .andWhere('orders.deliveryDate >= :startDate', {
        startDate: data.startDate,
      })
      .andWhere('orders.deliveryDate <= :endDate', {
        endDate: data.endDate,
      })
      .groupBy('foodId, nameFood, foods.description, deliveryDate, foods.image')
      .orderBy('deliveryDate', 'ASC')
      .execute();
    if (!list || list.length == 0) {
      throw new HttpException('No food found', HttpStatus.NOT_FOUND);
    } else {
      return list;
    }
  }

  async getOrderByStatus(orderFilter: OrderFilterDTO): Promise<OrderEntity[]> {
    const { status } = orderFilter;
    return await this.ordersRepository.find({
      where: { status: Like(Boolean(status) ? status : '%%') },
      relations: {
        subscription: { customer: { account: { profile: true } } },
        food: true,
        station: true,
        packageItem: true,
        kitchen: { account: { profile: true } },
        timeSlot: true,
      },
    });
  }

  async getOrderByStatusDate(
    deliveryDate: OrderSearchByDate,
    orderFilter: OrderFilterDTO,
  ): Promise<OrderEntity[]> {
    const { status } = orderFilter;
    return await this.ordersRepository.find({
      where: {
        status: Like(Boolean(status) ? status : '%%'),
        deliveryDate: deliveryDate.deliveryDate,
      },
      relations: {
        subscription: { customer: { account: { profile: true } } },
        food: true,
        station: true,
        packageItem: true,
        kitchen: true,
        timeSlot: true,
      },
    });
  }

  // async checkIn(id: string, user: AccountEntity): Promise<OrderEntity> {
  //   const order = await this.findById(id);
  //   if (order.customer.id !== user.customer.id)
  //     throw new HttpException(
  //       'You not owner of this order',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   order.status = OrderEnum.PENDING;
  //   const orderUpdated = await this.ordersRepository.save(order);
  //   if (!orderUpdated)
  //     throw new HttpException('Can not check in', HttpStatus.BAD_REQUEST);

  //   return orderUpdated;
  // }

  // async checkOut(id: string, user: AccountEntity): Promise<OrderEntity> {
  //   const order = await this.findById(id);
  //   if (order.customer.id !== user.customer.id)
  //     throw new HttpException(
  //       'You not owner of this order',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   order.status = OrderEnum.DONE;
  //   const orderUpdated = await this.ordersRepository.save(order);
  //   if (!orderUpdated)
  //     throw new HttpException('Can not check out', HttpStatus.BAD_REQUEST);

  //   return orderUpdated;
  // }

  // async tourGuideConfirmOrder(
  //   id: string,
  //   user: AccountEntity,
  //   status: StatusEnum,
  // ): Promise<string> {
  //   const order = await this.findById(id);
  //   if (order.tourGuide.id !== user.tourGuide.id)
  //     throw new HttpException(
  //       'You are not tour guide of this order',
  //       HttpStatus.BAD_REQUEST,
  //     );

  //   if (status === StatusEnum.ACCEPT) {
  //     order.status = StatusEnum.WAIT_PAYMENT;
  //   } else {
  //     order.status = StatusEnum.REJECT;
  //   }

  //   const orderUpdated = await this.ordersRepository.save(order);
  //   const title = `Your Order was ${status.toUpperCase()}ED`;
  //   const body = `Tour ${order.tour.name}`;
  //   const data = { ['idOrder']: order.id };
  //   const saveNotify = this.notificationsService.save({
  //     account: { id: order.tourist.account.id },
  //     title,
  //     body,
  //     data: JSON.stringify(data),
  //     type: TypeNotificationEnum.ORDER,
  //   });
  //   const sendNotify = this.firebaseMessageService.sendCustomNotification(
  //     order.tourist.account.deviceToken,
  //     title,
  //     body,
  //     data,
  //   );
  //   await saveNotify;
  //   await sendNotify;
  //   if (!orderUpdated)
  //     throw new HttpException('Can not check in', HttpStatus.BAD_REQUEST);
  //   return 'Update status successfully';
  // }

  //   async getMyOrders(
  //     user: AccountEntity,
  //     queries: OrderFilterMe,
  //   ): Promise<[OrderDto[], number]> {
  //     const { currentPage, sizePage, sort, status } = queries;
  //     let orders: OrderEntity[] = [];
  //     let count = 0;
  //     if (user.role.name === RoleEnum.TOURIST) {
  //       [orders, count] = await this.ordersRepository.findAndCount({
  //         where: {
  //           tourist: { id: user.tourist.id },
  //           status: status === undefined ? undefined : status,
  //         },
  //         relations: { tour: true, tourGuide: { account: { profile: true } } },
  //         skip: sizePage * (currentPage - 1),
  //         take: sizePage,
  //         order: { createdAt: sort === SortEnum.ASCENDING ? 'ASC' : 'DESC' },
  //       });
  //     }

  //     if (user.role.name === RoleEnum.TOUR_GUIDE) {
  //       [orders, count] = await this.ordersRepository.findAndCount({
  //         where: {
  //           tourGuide: { id: user.tourGuide.id },
  //           status: status === undefined ? undefined : status,
  //         },
  //         relations: { tour: true, tourist: { account: { profile: true } } },
  //         skip: sizePage * (currentPage - 1),
  //         take: sizePage,
  //         order: { createdAt: sort === SortEnum.ASCENDING ? 'ASC' : 'DESC' },
  //       });
  //     }

  //     return [this.mapper.mapArray(orders, OrderEntity, OrderDto), count];
  //   }

  //   async getPaymentUrl(
  //     ip: string,
  //     bankId: string,
  //     orderId: string,
  //   ): Promise<string> {
  //     const orderPromise = this.findOne({ where: { id: orderId } });
  //     const bankPromise = this.banksService.findOne({ where: { id: bankId } });

  //     const order = await orderPromise;
  //     if (!Boolean(order))
  //       throw new HttpException(`this order not existed`, HttpStatus.BAD_REQUEST);
  //     const twoHours = 2 * 60 * 60 * 1000;
  //     if (order.createdAt.getTime() + twoHours < Date.now()) {
  //       order.status = StatusEnum.CANCEL;
  //       await this.save(order);
  //       throw new HttpException('Your order expired', HttpStatus.BAD_REQUEST);
  //     }

  //     const bank = await bankPromise;
  //     if (!Boolean(bank))
  //       throw new HttpException(
  //         'this bank not supported',
  //         HttpStatus.BAD_REQUEST,
  //       );

  //     const orderInfo = `payment for order ${order.id}`;

  //     const result = this.vnpayService.payment(
  //       ip,
  //       order.totalPrice,
  //       bank.bankCode,
  //       orderInfo,
  //       'other',
  //       '',
  //     );
  //     return result;
  //   }

  //   async payment(
  //     vnpayDto: VnpayDto,
  //   ): Promise<{ message: string; code: string }> {
  //     const orderId = vnpayDto.vnp_OrderInfo.split(' ')[3];
  //     const orderPromise = this.findOne({ where: { id: orderId } });
  //     const paymentPromise = this.paymentsService.findOne({
  //       where: { transactionNo: vnpayDto.vnp_TransactionNo },
  //     });
  //     const bankPromise = this.banksService.findOne({
  //       where: { bankCode: vnpayDto.vnp_BankCode },
  //     });

  //     const paymentInDB = await paymentPromise;
  //     // Kiểm tra trong DB xem transaction này đã tồn tại chưa trong bảng payment tại cột transactionNo
  //     // nếu có payment chứng tỏ user đang request lần 2
  //     if (Boolean(paymentInDB))
  //       throw new HttpException(
  //         'This transaction invalid',
  //         HttpStatus.BAD_REQUEST,
  //       );

  //     const result = this.vnpayService.returnUrl(vnpayDto);
  //     if (!result || result.message !== 'success')
  //       throw new HttpException('You payment failed', HttpStatus.BAD_REQUEST);

  //     const order = await orderPromise;
  //     if (!Boolean(order))
  //       throw new HttpException(
  //         `this order [${orderId}] not existed`,
  //         HttpStatus.BAD_REQUEST,
  //       );

  //     // thêm thông tin transaction này vào DB tại bảng payment
  //     const bank = await bankPromise;
  //     const {
  //       vnp_PayDate,
  //       vnp_TransactionStatus,
  //       vnp_TransactionNo,
  //       vnp_BankTranNo,
  //       vnp_OrderInfo,
  //       vnp_CardType,
  //       vnp_Amount,
  //     } = vnpayDto;
  //     await this.paymentsService.save({
  //       bank,
  //       orderInfo: vnp_OrderInfo,
  //       amount: parseInt(vnp_Amount),
  //       transactionNo: vnp_TransactionNo,
  //       transactionStatus: vnp_TransactionStatus,
  //       bankTranNo: vnp_BankTranNo,
  //       cardType: vnp_CardType,
  //       payDate: vnp_PayDate,
  //       order: order,
  //     });

  //     order.status = StatusEnum.PENDING;
  //     await this.save(order);

  //     return result;
  //   }

  // async customerCancelOrder(
  //   id: string,
  //   user: AccountEntity,
  // ): Promise<OrderEntity> {
  //   const order = await this.findOne({
  //     where: { id },
  //     relations: { customer: true },
  //   });

  //   if (order.customer.id !== user.id)
  //     throw new HttpException(
  //       'You are not own this order',
  //       HttpStatus.BAD_REQUEST,
  //     );

  //   order.status = OrderEnum.CANCEL;
  //   order.cancelDate = new Date();
  //   const OrderNew = await this.save(order);

  //   // if (order.startDate.getDay() === new Date().getDay()) {
  //   //   console.log('cung ngay');
  //   //   return OrderNew;
  //   // }
  //   // if (order.startDate.getDay() + 2 === new Date().getDay()) {
  //   //   console.log('con 2 ngay');
  //   //   return OrderNew;
  //   // }

  //   return OrderNew;
  // }

  //   @Cron(CronExpression.EVERY_DAY_AT_11PM)
  //   async checkPaymentOrder(): Promise<void> {
  //     this.logger.log('Run check order payment');
  //     const orders = await this.query({
  //       where: { payment: null, status: Not(StatusEnum.CANCEL) },
  //     });
  //     const twoHours = 2 * 60 * 60 * 1000;
  //     for (const order of orders) {
  //       if (order.createdAt.getTime() + twoHours < Date.now()) {
  //         order.status = StatusEnum.CANCEL;
  //         order.cancelDate = new Date();
  //         const result = await this.save(order);
  //         this.logger.log(JSON.stringify(result));
  //       }
  //     }
  //   }

  //   @Interval(1000 * 60 * 15)
  //   async checkLateCheckIn(): Promise<void> {
  //     this.logger.log('Run check late check in');
  //     const now = new Date().toISOString().split('T')[0];
  //     const orders = await this.ordersRepository
  //       .createQueryBuilder()
  //       .select('orders')
  //       .from(OrderEntity, 'orders')
  //       .leftJoinAndSelect('orders.tourist', 'tourist')
  //       .leftJoinAndSelect('orders.tourGuide', 'tourGuide')
  //       .leftJoinAndSelect('tourist.account', 'touristAccount')
  //       .leftJoinAndSelect('tourGuide.account', 'tourGuideAccount')
  //       .where('(orders.startDate = :now) and (orders.status = :status)', {
  //         now,
  //         status: StatusEnum.PENDING,
  //       })
  //       .getMany();
  //     orders.forEach((order) => {
  //       const orderStartDateLate =
  //         new Date(`${order.startDate} ${order.startTime}`).getTime() +
  //         1000 * 60 * 15;
  //       if (orderStartDateLate < Date.now()) {
  //         const tokens = [
  //           order.tourist.account.deviceToken,
  //           order.tourGuide.account.deviceToken,
  //         ];
  //         this.firebaseMessage.sendCustomNotification(
  //           tokens,
  //           'remind',
  //           'Have you been to the rendezvous yet? Your tour today is already more than 15 minutes late',
  //           { orderId: order.id },
  //         );
  //       }
  //     });
  //   }
}
