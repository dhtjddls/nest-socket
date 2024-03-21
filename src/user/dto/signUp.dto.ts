import { PickType } from '@nestjs/swagger';
import { user } from 'src/user/entity/user.entity';

export class SignUpDto extends PickType(user, ['email', 'password']) {}
