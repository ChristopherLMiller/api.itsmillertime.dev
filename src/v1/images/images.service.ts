import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { firstValueFrom } from 'rxjs';
import { ImageExif } from 'src/prisma/dto.ts/imageExif.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReponseData } from 'types';

const ExifImage = require('exif').ExifImage;

@Injectable()
export class ImagesService {
  constructor(
    private httpService: HttpService,
    private prisma: PrismaService,
  ) {}

  async getExifData(
    image: string,
    cache: boolean = true,
  ): Promise<ReponseData<ImageExif | Prisma.InputJsonObject>> {
    // we take different paths depending on if the user wants cached data or not
    if (cache) {
      // See if the data already exists
      const exifData = await this.prisma.imageExif.findUnique({
        where: { url: image },
      });

      // If we have valid data lets return it now
      if (exifData) {
        console.log('exifData was found in the cache');
        return { data: exifData, meta: { cached: true, url: image } };
      }
    }

    // Fetch the image
    const imageData = await firstValueFrom(
      this.httpService.get(image, {
        responseType: 'arraybuffer',
      }),
    );

    // Extract the EXIF data from the image
    const promiseReponse = new Promise((resolve, reject) => {
      new ExifImage({ image: imageData.data }, (error, exifData) => {
        if (error) {
          reject(error);
        } else {
          resolve(exifData);
        }
      });
    });

    // this is the meta of the image here
    const imageMeta = (await promiseReponse) as Prisma.InputJsonObject;
    console.log(imageMeta);

    // If we are caching the result, lets store that
    if (cache === true) {
      const insertedData = await this.prisma.imageExif.create({
        data: { url: image, exif: imageMeta },
      });
      return {
        data: insertedData,
        meta: { cached: cache, url: image },
      };
    } else {
      // We are not caching, lets return the data
      return {
        data: imageMeta,
        meta: { cached: cache, url: image },
      };
    }
  }
}
