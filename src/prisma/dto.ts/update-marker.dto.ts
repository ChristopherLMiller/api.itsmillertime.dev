
import {Prisma} from '@prisma/client'




export class UpdateMarkerDto {
  lat?: Prisma.Decimal;
lon?: Prisma.Decimal;
title?: string;
siteURL?: string;
galleryURL?: string;
}
