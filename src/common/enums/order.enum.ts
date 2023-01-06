export enum OrderEnum {
  // UNCONFIRMED = 'unconfirmed',
  // WAIT_PAYMENT = 'waitPayment',
  PENDING = 'pending', // đã nhận đơn
  PROGRESS = 'progress', // đang xữ lý
  DELIVERY = 'delivery', // đang giao
  READY = 'ready', // chờ giao
  ARRIVED = 'arrived', // đã đến nơi
  DONE = 'done', // đã giao
  // BAN = 'ban',
  //   REJECT = 'reject',
  // CANCEL = 'cancel',
}
