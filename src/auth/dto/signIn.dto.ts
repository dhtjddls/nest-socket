import { PickType } from '@nestjs/swagger';
import { user } from 'src/user/entity/user.entity';

export class SignInDto extends PickType(user, ['email', 'password']) {}
