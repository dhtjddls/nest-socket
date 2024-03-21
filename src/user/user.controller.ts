import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { SignUpDto } from './dto/signUp.dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    return await this.userService.signUp(signUpDto);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('/')
  async findAll(@Req() req: any) {
    console.log(req.user);
    return await this.userService.findAll();
  }
}
