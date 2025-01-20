import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Session,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

@Controller('auth')
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/register')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const userResponse = await this.authService.signup(
      body.email,
      body.password,
      body.role,
    );

    const { user } = userResponse;
    session.userId = user.id;
    return userResponse;
  }

  @Post('/login')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const userResponse = await this.authService.signin(
      body.email,
      body.password,
    );

    const { user } = userResponse;
    session.userId = user.id;
    return userResponse;
  }

  @Get('/admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  getAdminData() {
    return 'Admin data accessed';
  }

  @Get('/user')
  @UseGuards(AuthGuard)
  getUserData() {
    return 'User data accessed';
  }
}
