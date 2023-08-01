import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/createUser.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { RegisterUserDto } from './dtos/registerUser.dto';
import { Permission } from 'src/helpers/checkPermission.helper';
import * as bcrypt from 'bcrypt';
import { UserHelper } from 'src/helpers/user.helper';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  // CRUD
  create(requestBody: RegisterUserDto) {
    const user = this.userRepo.create(requestBody);

    return this.userRepo.save(user);
  }

  findAll() {
    return this.userRepo.find();
  }

  findById(id: number) {
    return this.userRepo.findOneBy({ id });
  }

  findByEmail(email: string) {
    return this.userRepo.findOneBy({ email });
  }

  async updateById(id: number, requestBody: UpdateUserDto, currentUser: User) {
    if (requestBody.role) {
      throw new BadRequestException('You cannot change role');
    }

    let user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const userByEmail = await this.findByEmail(requestBody.email);
    if (userByEmail) {
      throw new BadRequestException('Email already exist');
    }

    // id: 1 !== update id: 2
    Permission.check(id, currentUser);

    user = { ...user, ...requestBody };

    // hash password
    UserHelper.hashPassword(requestBody.password);

    const updatedUser = await this.userRepo.save(user);

    return {
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
    };
  }

  async deleteById(id: number, currentUser: User) {
    const user = await this.findById(id);

    Permission.check(id, currentUser);

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    return this.userRepo.remove(user);
  }
}
