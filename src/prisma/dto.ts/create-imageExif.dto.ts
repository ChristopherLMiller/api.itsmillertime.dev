
import {Prisma} from '@prisma/client'




export class CreateImageExifDto {
  url: string;
exif: Prisma.InputJsonValue;
}
