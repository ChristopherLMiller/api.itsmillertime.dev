
import {Prisma} from '@prisma/client'


export class Marker {
  id: number ;
lat: Prisma.Decimal ;
lon: Prisma.Decimal ;
title: string ;
siteURL: string ;
galleryURL: string ;
visited: boolean ;
visits: number ;
rating: number ;
}
