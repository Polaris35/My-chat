import { ApiProperty } from '@nestjs/swagger';

export class AttachmentDataResponse {
    @ApiProperty()
    id: number;
    @ApiProperty()
    fileName: string;
    @ApiProperty()
    format: string;
    @ApiProperty()
    size: number;
}
