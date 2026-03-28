import { Body, Controller, Get, Post } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dtos/create-tag.dto';

@Controller('tags')
export class TagsController {
    constructor(private tagsService: TagsService) {}

    @Get()
    getAllTags(){
        return this.tagsService.findAllTags();
    }

    @Post()
    createTag(@Body() body: CreateTagDto){
        return this.tagsService.createTag(body.name);
    }
}
