import { ApiProperty } from '@nestjs/swagger';

export class StartTimerDto {
  @ApiProperty({ name: 'projectID', type: 'string', required: true })
  projectID: string;
}
