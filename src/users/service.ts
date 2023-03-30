import { Prisma, PrismaClient, users as UserModel } from "@prisma/client";

export default class UserService {
  private static prisma = new PrismaClient();

  static async findAll(): Promise<UserModel[] | undefined> {
    const users: UserModel[] = await this.prisma.users.findMany();
    return users;
  }

  static async findOne(
    where: Prisma.usersWhereInput
  ): Promise<UserModel | null> {
    const user: UserModel | null = await this.prisma.users.findFirst({ where });
    return user;
  }

  static async create(data: Prisma.usersCreateInput): Promise<UserModel> {
    const user: UserModel = await this.prisma.users.create({ data });
    return user;
  }

  static async update(
    where: Prisma.usersWhereUniqueInput,
    data: Prisma.usersUpdateInput
  ): Promise<UserModel> {
    const user: UserModel = await this.prisma.users.update({ where, data });
    return user;
  }

  static async delete(where: Prisma.usersWhereUniqueInput): Promise<UserModel> {
    const user: UserModel = await this.prisma.users.delete({ where });
    return user;
  }
}
