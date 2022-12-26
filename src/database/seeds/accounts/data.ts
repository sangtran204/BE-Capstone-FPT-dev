import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { RoleEnum } from 'src/common/enums/role.enum';
import { StatusEnum } from 'src/common/enums/status.enum';

const pass = bcrypt.hashSync('Tien1235!', 10);

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
    phone: '0346754957',
    password: pass,
    role: RoleEnum.ADMIN,
    status: StatusEnum.ACTIVE,
    fullName: 'Võ Minh Tiến',
    dob: faker.date.birthdate(),
    avatar:
      'https://firebasestorage.googleapis.com/v0/b/meal-subcription-plan.appspot.com/o/default_avatar.png?alt=media&token=5623e4d3-4139-4fb8-abd0-eea54c02cc83',
    email: 'tienvmt02@gmail.com',
  },
  {
    phone: '0363946361',
    password: pass,
    role: RoleEnum.MANAGER,
    status: StatusEnum.ACTIVE,
    fullName: 'Phạm Mạnh Toàn',
    dob: faker.date.birthdate(),
    avatar:
      'https://firebasestorage.googleapis.com/v0/b/meal-subcription-plan.appspot.com/o/default_avatar.png?alt=media&token=5623e4d3-4139-4fb8-abd0-eea54c02cc83',
    email: 'toanpm@gmail.com',
  },
  {
    phone: '0969080408',
    password: pass,
    role: RoleEnum.MANAGER,
    status: StatusEnum.ACTIVE,
    fullName: 'Huỳnh Ngọc Linh',
    dob: faker.date.birthdate(),
    avatar:
      'https://firebasestorage.googleapis.com/v0/b/meal-subcription-plan.appspot.com/o/default_avatar.png?alt=media&token=5623e4d3-4139-4fb8-abd0-eea54c02cc83',
    email: 'linhhn2zz@gmail.com',
  },
  {
    phone: '0901384204',
    password: pass,
    role: RoleEnum.SHIPPER,
    status: StatusEnum.ACTIVE,
    fullName: 'Thanh Nhi',
    dob: faker.date.birthdate(),
    avatar:
      'https://firebasestorage.googleapis.com/v0/b/meal-subcription-plan.appspot.com/o/default_avatar.png?alt=media&token=5623e4d3-4139-4fb8-abd0-eea54c02cc83',
    email: 'nhipt2k@gmail.com',
  },
  {
    phone: '0346754959',
    password: pass,
    role: RoleEnum.KITCHEN,
    status: StatusEnum.ACTIVE,
    fullName: 'Bếp Quận 9',
    dob: faker.date.birthdate(),
    avatar:
      'https://firebasestorage.googleapis.com/v0/b/meal-subcription-plan.appspot.com/o/default_avatar.png?alt=media&token=5623e4d3-4139-4fb8-abd0-eea54c02cc83',
    email: 'bepquan9mesup@gmail.com',
  },
  {
    phone: '0392317266',
    password: pass,
    role: RoleEnum.CUSTOMER,
    status: StatusEnum.ACTIVE,
    fullName: 'Anh Sang',
    dob: faker.date.birthdate(),
    avatar:
      'https://firebasestorage.googleapis.com/v0/b/meal-subcription-plan.appspot.com/o/default_avatar.png?alt=media&token=5623e4d3-4139-4fb8-abd0-eea54c02cc83',
    email: 'sangtran@gmail.com',
  },
  {
    phone: '0974445276',
    password: pass,
    role: RoleEnum.CUSTOMER,
    status: StatusEnum.ACTIVE,
    fullName: 'Quốc Lộc',
    dob: faker.date.birthdate(),
    avatar:
      'https://firebasestorage.googleapis.com/v0/b/meal-subcription-plan.appspot.com/o/default_avatar.png?alt=media&token=5623e4d3-4139-4fb8-abd0-eea54c02cc83',
    email: 'locdq@gmail.com',
  },
];
