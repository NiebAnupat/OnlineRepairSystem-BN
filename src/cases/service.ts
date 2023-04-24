import { cases as CaseModel, Prisma, PrismaClient } from "@prisma/client";

export default class CaseService {
  private static prisma = new PrismaClient();

  static async findAll(): Promise<CaseModel[] | undefined> {
    return await this.prisma.cases.findMany({
      include: {
        statuses: true,
        users_cases_tec_idTousers: {
          select: {
            user_id: true,
            username: true,
          },
        },
        users_cases_user_idTousers: {
          select: {
            user_id: true,
            username: true,
          },
        },
        images: true,
      },
    });
  }

  static async findOne(
    where: Prisma.casesWhereUniqueInput
  ): Promise<CaseModel | null> {
    return await this.prisma.cases.findFirst({
      where,
      include: {
        statuses: true,
        users_cases_tec_idTousers: {
          select: {
            user_id: true,
            username: true,
          },
        },
        users_cases_user_idTousers: {
          select: {
            user_id: true,
            username: true,
          },
        },
        images: true,
      },
    });
  }

  static async findMany(
    where: Prisma.casesWhereInput,
    getImage : boolean = false
  ): Promise<CaseModel[] | undefined> {
    return await this.prisma.cases.findMany({
      where,
      include: {
        statuses: true,
        users_cases_tec_idTousers: {
          select: {
            user_id: true,
            username: true,
          },
        },
        users_cases_user_idTousers: {
          select: {
            user_id: true,
            username: true,
          },
        },
        images: getImage,
      },
    });
  }

  static async create(data: Prisma.casesCreateInput): Promise<CaseModel> {
    return await this.prisma.cases.create({ data });
  }

  static async update(
    where: Prisma.casesWhereUniqueInput,
    data: Prisma.casesUpdateInput
  ): Promise<CaseModel> {
    return await this.prisma.cases.update({ where, data });
  }

  static async delete(where: Prisma.casesWhereUniqueInput): Promise<CaseModel> {
    return await this.prisma.cases.delete({
      where,
    });
  }
}
