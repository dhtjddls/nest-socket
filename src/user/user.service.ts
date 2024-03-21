import { Injectable } from '@nestjs/common';
import { hash } from 'src/common/utils/bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './dto/signUp.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(email: string) {
    return await this.prisma.user.findFirst({ where: { email: email } });
  }

  async findAll() {
    return (await this.prisma.user.findMany({})) || [];
  }

  async signUp(signUpDto: SignUpDto) {
    signUpDto.password = await hash(signUpDto.password);

    return await this.prisma.user.create({ data: signUpDto });
  }
}
