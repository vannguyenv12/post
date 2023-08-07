import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dtos/createPost.dto';
import { User } from 'src/user/user.entity';

@Injectable()
export class PostService {
  constructor(@InjectRepository(Post) private postRepo: Repository<Post>) {}

  // CRUD
  create(requestBody: CreatePostDto, currentUser: User) {
    const post = this.postRepo.create(requestBody);

    post.user = currentUser;

    return this.postRepo.save(post);
  }
}
