import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Delete,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dtos/createPost.dto';
import { CurrentUser } from 'src/user/decorators/currentUser.decorator';
import { User } from 'src/user/user.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { UpdatePostDto } from './dtos/updatePost.dto';

@Controller('api/v1/posts')
@UseInterceptors(ClassSerializerInterceptor)
export class PostController {
  constructor(private postService: PostService) {}

  @Post()
  @UseGuards(AuthGuard)
  createPost(
    @Body() requestBody: CreatePostDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.postService.create(requestBody, currentUser);
  }

  @Get()
  findPosts() {
    return this.postService.getAll();
  }

  @Get('/:id')
  findPost(@Param('id', ParseIntPipe) id: number) {
    return this.postService.get(id);
  }

  @Put('/:id')
  @UseGuards(AuthGuard)
  updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() requestBody: UpdatePostDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.postService.update(id, requestBody, currentUser);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  deletePost(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: User,
  ) {
    return this.postService.delete(id, currentUser);
  }
}
