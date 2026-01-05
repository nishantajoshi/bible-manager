import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
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
import { VerseService } from './verse.service';
import { CreateVerseDto } from './dto/create-verse.dto';
import { UpdateVerseDto } from './dto/update-verse.dto';
import { BulkCreateVerseDto } from './dto/bulk-create-verse.dto';
import { FilterVerseDto } from './dto/filter-verse.dto';
import { Verse } from './entities/verse.entity';

@ApiTags('verses')
@Controller('verses')
export class VerseController {
  constructor(private readonly verseService: VerseService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new verse' })
  @ApiResponse({
    status: 201,
    description: 'Verse created successfully',
    type: Verse,
  })
  @ApiResponse({ status: 400, description: 'Chapter not found' })
  @ApiResponse({ status: 409, description: 'Verse already exists' })
  create(@Body() createVerseDto: CreateVerseDto) {
    return this.verseService.create(createVerseDto);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Create multiple verses at once' })
  @ApiResponse({
    status: 201,
    description: 'Verses created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Chapter not found or duplicate verse numbers',
  })
  @ApiResponse({ status: 409, description: 'Some verses already exist' })
  bulkCreate(@Body() bulkCreateVerseDto: BulkCreateVerseDto) {
    return this.verseService.bulkCreate(bulkCreateVerseDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all verses with optional filtering and pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'List of verses',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'chapterId', required: false, type: Number })
  findAll(@Query() filterDto: FilterVerseDto) {
    return this.verseService.findAll(
      filterDto.page,
      filterDto.limit,
      filterDto.chapterId,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a verse by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Verse found',
    type: Verse,
  })
  @ApiResponse({ status: 404, description: 'Verse not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.verseService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a verse' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Verse updated',
    type: Verse,
  })
  @ApiResponse({ status: 404, description: 'Verse not found' })
  @ApiResponse({ status: 400, description: 'Chapter not found' })
  @ApiResponse({ status: 409, description: 'Verse number conflict' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVerseDto: UpdateVerseDto,
  ) {
    return this.verseService.update(id, updateVerseDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a verse' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204, description: 'Verse deleted' })
  @ApiResponse({ status: 404, description: 'Verse not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.verseService.remove(id);
  }
}
