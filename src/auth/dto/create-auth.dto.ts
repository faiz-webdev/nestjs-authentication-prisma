import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({
    example: 'test@gmail.com',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @ApiProperty({
    example: '123#4@.123',
    required: true,
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 20, {
    message: 'Password has to be at between 3 and 20 characters',
  })
  public password: string;
}
