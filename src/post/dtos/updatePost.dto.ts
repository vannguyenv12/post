import { IsNotEmpty, Length } from 'class-validator';
import { MaxLength } from 'class-validator';

export class UpdatePostDto {
  @IsNotEmpty()
  @Length(4, 40)
  title: string;

  @MaxLength(255, {
    message: 'Description is too long',
  })
  description: string;
}
