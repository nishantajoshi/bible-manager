import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ChapterService } from './chapter.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { FilterChapterDto } from './dto/filter-chapter.dto';
import { Chapter } from './entities/chapter.entity';

@ApiTags('chapters')
@Controller('chapters')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new chapter' })
  @ApiResponse({
    status: 201,
    description: 'Chapter created successfully',
    type: Chapter,
  })
  @ApiResponse({ status: 400, description: 'Book not found' })
  @ApiResponse({ status: 409, description: 'Chapter already exists' })
  create(@Body() createChapterDto: CreateChapterDto) {
    return this.chapterService.create(createChapterDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all chapters with optional filtering' })
  @ApiResponse({
    status: 200,
    description: 'List of chapters',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'bookId', required: false, type: String })
  findAll(@Query() filterDto: FilterChapterDto) {
    return this.chapterService.findAll(
      filterDto.page,
      filterDto.limit,
      filterDto.bookId,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a chapter by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Chapter found',
    type: Chapter,
  })
  @ApiResponse({ status: 404, description: 'Chapter not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.chapterService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a chapter' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Chapter updated',
    type: Chapter,
  })
  @ApiResponse({ status: 404, description: 'Chapter not found' })
  @ApiResponse({ status: 400, description: 'Book not found' })
  @ApiResponse({ status: 409, description: 'Chapter number conflict' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateChapterDto: UpdateChapterDto,
  ) {
    return this.chapterService.update(id, updateChapterDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a chapter' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 204, description: 'Chapter deleted' })
  @ApiResponse({ status: 404, description: 'Chapter not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.chapterService.remove(id);
  }
}
