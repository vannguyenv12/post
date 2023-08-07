import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dtos/createPost.dto';
import { User } from 'src/user/user.entity';
import { UpdatePostDto } from './dtos/updatePost.dto';
import { Permission } from 'src/helpers/checkPermission.helper';

@Injectable()
export class PostService {
  constructor(@InjectRepository(Post) private postRepo: Repository<Post>) {}

  // CRUD
  create(requestBody: CreatePostDto, currentUser: User) {
    const post = this.postRepo.create(requestBody);

    post.user = currentUser;

    return this.postRepo.save(post);
  }

  getAll() {
    return this.postRepo.find();
  }

  get(id: number) {
    return this.postRepo.findOneBy({ id });
  }

  async update(id: number, requestBody: UpdatePostDto, currentUser: User) {
    let post = await this.postRepo.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });

    if (!post) {
      throw new NotFoundException(`Not found post with id ${id}`);
    }

    Permission.check(post.user.id, currentUser);

    post = { ...post, ...requestBody };

    return this.serialize(await this.postRepo.save(post));
  }

  async delete(id: number, currentUser: User) {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });
    if (!post) {
      throw new NotFoundException(`Not found post with id ${id}`);
    }
    Permission.check(post.user.id, currentUser);

    return this.postRepo.remove(post);
  }

  async serialize(post: Post) {
    return { ...post, user: post.user.id };
  }
}
