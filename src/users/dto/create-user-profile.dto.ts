import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserProfileDto {
  @IsNotEmpty()
  @IsString()
  public bio: string;

  @IsNotEmpty()
  @IsString()
  public userId: string;
}
