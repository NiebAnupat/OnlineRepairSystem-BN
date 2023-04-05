import { Prisma, PrismaClient, cases as CaseModel } from "@prisma/client";

export default class CaseService {
  private static prisma = new PrismaClient();

  static async findAll(): Promise<CaseModel[] | undefined> {
    const cases: CaseModel[] = await this.prisma.cases.findMany();
    return cases;
  }

  static async findOne(
    where: Prisma.casesWhereUniqueInput
  ): Promise<CaseModel | null> {
    const cases: CaseModel | null = await this.prisma.cases.findFirst({
      where,
      include: {
        images: true,
      }
    });
    return cases;
  }

  static async findMany(
    where: Prisma.casesWhereInput
  ): Promise<CaseModel[] | undefined> {
    const cases: CaseModel[] = await this.prisma.cases.findMany({ where });
    return cases;
  }

  static async create(data: Prisma.casesCreateInput): Promise<CaseModel> {
    const cases: CaseModel = await this.prisma.cases.create({ data });
    return cases;
  }

  static async update(
    where: Prisma.casesWhereUniqueInput,
    data: Prisma.casesUpdateInput
  ): Promise<CaseModel> {
    const cases: CaseModel = await this.prisma.cases.update({ where, data });
    return cases;
  }
}
