import { Prisma } from '@prisma/client';

export class ImageExif {
  id: number;
  url: string;
  exif: Prisma.JsonValue;
}
