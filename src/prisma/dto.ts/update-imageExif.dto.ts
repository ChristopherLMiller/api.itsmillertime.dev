
import {Prisma} from '@prisma/client'




export class UpdateImageExifDto {
  url?: string;
exif?: Prisma.InputJsonValue;
}
