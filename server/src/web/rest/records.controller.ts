import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    Post as PostMethod,
    Put,
    UseGuards,
    Req,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { RecordsDTO } from '../../service/dto/records.dto';
import { RecordsService } from '../../service/records.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/records')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('records')
export class RecordsController {
    logger = new Logger('RecordsController');

    constructor(private readonly recordsService: RecordsService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: RecordsDTO,
    })
    async getAll(@Req() req: Request): Promise<RecordsDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.recordsService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
        });
        HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
        return results;
    }

    @Get('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: RecordsDTO,
    })
    async getOne(@Param('id') id: number): Promise<RecordsDTO> {
        return await this.recordsService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create records' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: RecordsDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() recordsDTO: RecordsDTO): Promise<RecordsDTO> {
        const created = await this.recordsService.save(recordsDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Records', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update records' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: RecordsDTO,
    })
    async put(@Req() req: Request, @Body() recordsDTO: RecordsDTO): Promise<RecordsDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Records', recordsDTO.id);
        return await this.recordsService.update(recordsDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update records with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: RecordsDTO,
    })
    async putId(@Req() req: Request, @Body() recordsDTO: RecordsDTO): Promise<RecordsDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Records', recordsDTO.id);
        return await this.recordsService.update(recordsDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete records' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Records', id);
        return await this.recordsService.deleteById(id);
    }
}
