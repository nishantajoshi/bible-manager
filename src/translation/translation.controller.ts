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
import { TranslationService } from './translation.service';
import { CreateTranslationDto } from './dto/create-translation.dto';
import { UpdateTranslationDto } from './dto/update-translation.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Translation } from './entities/translation.entity';

@ApiTags('translations')
@Controller('translations')
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Bible translation' })
  @ApiResponse({
    status: 201,
    description: 'Translation created successfully',
    type: Translation,
  })
  @ApiResponse({ status: 409, description: 'Translation already exists' })
  create(@Body() createTranslationDto: CreateTranslationDto) {
    return this.translationService.create(createTranslationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all translations with pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of translations',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.translationService.findAll(
      paginationDto.page,
      paginationDto.limit,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a translation by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Translation found',
    type: Translation,
  })
  @ApiResponse({ status: 404, description: 'Translation not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.translationService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a translation' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Translation updated',
    type: Translation,
  })
  @ApiResponse({ status: 404, description: 'Translation not found' })
  @ApiResponse({
    status: 409,
    description: 'Conflict with existing translation',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTranslationDto: UpdateTranslationDto,
  ) {
    return this.translationService.update(id, updateTranslationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a translation' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204, description: 'Translation deleted' })
  @ApiResponse({ status: 404, description: 'Translation not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.translationService.remove(id);
  }
}
