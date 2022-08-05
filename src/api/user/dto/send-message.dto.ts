import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
  constructor(chatId: number, text: string) {
    this.chatId = chatId;
    this.text = text;
  }

  @ApiProperty()
  @IsNumber()
  chatId: number;

  @ApiProperty()
  @IsString()
  text: string;
}
