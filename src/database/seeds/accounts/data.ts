import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { RoleEnum } from 'src/common/enums/role.enum';
import { StatusEnum } from 'src/common/enums/status.enum';

const pass = bcrypt.hashSync('123456', 10);

export const getData = (): {
  phone: string;
  password: string;
  role: RoleEnum;
  status: StatusEnum;
  fullName: string;
  dob: Date;
  avatar: string;
  email: string;
}[] => [
  {
    phone: '0123456788',
    password: pass,
    role: RoleEnum.ADMIN,
    status: StatusEnum.ACTIVE,
    fullName: faker.name.firstName(),
    dob: faker.date.birthdate(),
    avatar: '/images/default.png',
    email: 'minhT@gmail.com',
  },
  {
    phone: '0123456789',
    password: pass,
    role: RoleEnum.MANAGER,
    status: StatusEnum.ACTIVE,
    fullName: faker.name.firstName(),
    dob: faker.date.birthdate(),
    avatar: '/images/default.png',
    email: 'nhi123@gmail.com',
  },
  {
    phone: '0777888999',
    password: pass,
    role: RoleEnum.MANAGER,
    status: StatusEnum.ACTIVE,
    fullName: faker.name.firstName(),
    dob: faker.date.birthdate(),
    avatar: '/images/default.png',
    email: 'tsama@gmail.com',
  },
  {
    phone: '0111222333',
    password: pass,
    role: RoleEnum.SHIPPER,
    status: StatusEnum.ACTIVE,
    fullName: faker.name.firstName(),
    dob: faker.date.birthdate(),
    avatar: '/images/default.png',
    email: 'shipper@gmail.com',
  },
  {
    phone: '0456789123',
    password: pass,
    role: RoleEnum.SHIPPER,
    status: StatusEnum.ACTIVE,
    fullName: faker.name.firstName(),
    dob: faker.date.birthdate(),
    avatar: '/images/default.png',
    email: 'shipper123@gmail.com',
  },
  {
    phone: '0123456787',
    password: pass,
    role: RoleEnum.KITCHEN,
    status: StatusEnum.ACTIVE,
    fullName: faker.name.firstName(),
    dob: faker.date.birthdate(),
    avatar: '/images/default.png',
    email: 'kitchen@gmail.com',
  },
  {
    phone: '0111223344',
    password: pass,
    role: RoleEnum.KITCHEN,
    status: StatusEnum.ACTIVE,
    fullName: faker.name.firstName(),
    dob: faker.date.birthdate(),
    avatar: '/images/default.png',
    email: 'kitchen1213@gmail.com',
  },
  {
    phone: '0123456786',
    password: pass,
    role: RoleEnum.ADMIN,
    status: StatusEnum.ACTIVE,
    fullName: faker.name.firstName(),
    dob: faker.date.birthdate(),
    avatar: '/images/default.png',
    email: 'admin2@gmail.com',
  },
  {
    phone: '0123456785',
    password: pass,
    role: RoleEnum.CUSTOMER,
    status: StatusEnum.ACTIVE,
    fullName: faker.name.firstName(),
    dob: faker.date.birthdate(),
    avatar: '/images/default.png',
    email: 'sangtran@gmail.com',
  },
  {
    phone: '0123456784',
    password: pass,
    role: RoleEnum.CUSTOMER,
    status: StatusEnum.IN_ACTIVE,
    fullName: faker.name.firstName(),
    dob: faker.date.birthdate(),
    avatar: '/images/default.png',
    email: 'tien@gmail.com',
  },
];
