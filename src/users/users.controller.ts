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
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth') // Tag the controller for Swagger
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
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
  @ApiOperation({ summary: 'Login a user and receive authentication token' })
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
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
