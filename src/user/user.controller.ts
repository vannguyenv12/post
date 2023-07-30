import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Param,
  ParseIntPipe,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/createUser.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { LoggingInterceptor } from 'src/interceptors/logging.interceptor';
import { AuthGuard } from 'src/guards/auth.guard';
import { RegisterUserDto } from './dtos/registerUser.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/LoginUser.dto';
import { CurrentUser } from './decorators/currentUser.decorator';
import { User } from './user.entity';

@Controller('/api/v1/users')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LoggingInterceptor)
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  getAllUser() {
    console.log('Second!!');
    return this.userService.findAll();
  }

  @Get('/current-user')
  @UseGuards(AuthGuard)
  getCurrentUser(@CurrentUser() currentUser: User) {
    return currentUser;
  }

  @Get('/:id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findById(id);
  }

  @Put('/:id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() requestBody: UpdateUserDto,
  ) {
    return this.userService.updateById(id, requestBody);
  }

  @Delete('/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteById(id);
  }

  @Post('/register')
  registerUser(@Body() requestBody: RegisterUserDto) {
    return this.authService.register(requestBody);
  }

  @Post('/login')
  loginUser(@Body() requestBody: LoginUserDto) {
    return this.authService.login(requestBody);
  }
}
