import { Prisma, PrismaClient, images as ImageModel } from "@prisma/client";

export default class CaseService {
  private static prisma = new PrismaClient();

  static async findAll(): Promise<ImageModel[] | undefined> {
    const images: ImageModel[] = await this.prisma.images.findMany();
    return images;
  }

  static async findOne(
    where: Prisma.imagesWhereUniqueInput
  ): Promise<ImageModel | null> {
    const images: ImageModel | null = await this.prisma.images.findFirst({
      where,
    });
    return images;
  }

  static async findMany(
    where: Prisma.imagesWhereInput
  ): Promise<ImageModel[] | undefined> {
    const images: ImageModel[] = await this.prisma.images.findMany({ where });
    return images;
  }

  static async create(data: Prisma.imagesCreateInput): Promise<ImageModel> {
    const images: ImageModel = await this.prisma.images.create({ data });
    return images;
  }

  static async update(
    where: Prisma.imagesWhereUniqueInput,
    data: Prisma.imagesUpdateInput
  ): Promise<ImageModel> {
    const images: ImageModel = await this.prisma.images.update({ where, data });
    return images;
  }

  static async delete(
    where: Prisma.imagesWhereUniqueInput
  ): Promise<ImageModel> {
    const images: ImageModel = await this.prisma.images.delete({
      where,
    });
    return images;
  }

  static async deleteMany(
    where: Prisma.imagesWhereInput
  ): Promise<Prisma.BatchPayload> {
    const images: Prisma.BatchPayload = await this.prisma.images.deleteMany({
      where,
    });
    return images;
  }
}
