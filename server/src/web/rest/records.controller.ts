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
import { BlockChainDTO } from '../../service/dto/block-chain.dto';
import { BlockChainService } from '../../service/block-chain.service';
import { sha256 } from 'js-sha256';

@Controller('api/records')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('records')
export class RecordsController {
    logger = new Logger('RecordsController');

    constructor(
        private readonly recordsService: RecordsService,
        private readonly blockChainService: BlockChainService,
    ) {}

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
        const date = new Date(recordsDTO.startDate);
        date.setDate(date.getDate() + 1);
        recordsDTO.endDate = date;
        const created = await this.recordsService.save(recordsDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Records', created.id);
        return created;
    }
    @PostMethod('/create/key')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create key' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: RecordsDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async generateSecurityKey(@Req() req: Request, @Body() recordsDTO: RecordsDTO): Promise<RecordsDTO> {
        const bodyKey = {
            startDate: recordsDTO.startDate,
            endDate: recordsDTO.endDate,
            owner: recordsDTO.owner,
            device: recordsDTO.device,
        };
        //console.log(bodyKey);
        recordsDTO.securityKey = this.createHash(bodyKey);
        //console.log(recordsDTO);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Records', recordsDTO.id);
        return await this.recordsService.update(recordsDTO, req.user?.login);
    }
    @PostMethod('/create/block')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create block' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: RecordsDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async generateBlock(@Req() req: Request, @Body() recordsDTO: RecordsDTO): Promise<RecordsDTO> {
        const idPrevious = recordsDTO.id - 1;
        //console.log(recordsDTO.id);
        //console.log(idPrevious);
        let block = {};
        if (idPrevious == 0) {
            block = {
                index: recordsDTO.id,
                endDate: recordsDTO.endDate,
                date: new Date(),
                data: recordsDTO,
                previousHash: '',
                hash: this.createHash({
                    index: recordsDTO.id,
                    endDate: recordsDTO.endDate,
                    date: new Date(),
                    data: recordsDTO,
                    previousHash: '',
                }),
            };
        } else {
            const previousRecord = await this.recordsService.findById(idPrevious);
            block = {
                index: recordsDTO.id,
                endDate: recordsDTO.endDate,
                date: new Date(),
                data: recordsDTO,
                previousHash: previousRecord.detailsProcess,
                hash: this.createHash({
                    index: recordsDTO.id,
                    endDate: recordsDTO.endDate,
                    date: new Date(),
                    data: recordsDTO,
                    previousHash: previousRecord.detailsProcess,
                }),
            };
        }
        recordsDTO.detailsProcess = block['hash'];
        const updated = await this.recordsService.update(recordsDTO, req.user?.login);
        const blockChainDTO = new BlockChainDTO();
        blockChainDTO.block = JSON.stringify(block);
        await this.blockChainService.save(blockChainDTO, req.user?.login);

        HeaderUtil.addEntityCreatedHeaders(req.res, 'Records', recordsDTO.id);
        return updated;
    }
    createHash(data: any) {
        const hash = sha256.create();
        hash.update(JSON.stringify(data));
        hash.hex();
        //console.log(hash);
        return hash.toString();
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
