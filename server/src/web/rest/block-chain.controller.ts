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
import { BlockChainDTO } from '../../service/dto/block-chain.dto';
import { BlockChainService } from '../../service/block-chain.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/block-chains')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('block-chains')
export class BlockChainController {
    logger = new Logger('BlockChainController');

    constructor(private readonly blockChainService: BlockChainService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: BlockChainDTO,
    })
    async getAll(@Req() req: Request): Promise<BlockChainDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.blockChainService.findAndCount({
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
        type: BlockChainDTO,
    })
    async getOne(@Param('id') id: number): Promise<BlockChainDTO> {
        return await this.blockChainService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create blockChain' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: BlockChainDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() blockChainDTO: BlockChainDTO): Promise<BlockChainDTO> {
        const created = await this.blockChainService.save(blockChainDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'BlockChain', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update blockChain' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: BlockChainDTO,
    })
    async put(@Req() req: Request, @Body() blockChainDTO: BlockChainDTO): Promise<BlockChainDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'BlockChain', blockChainDTO.id);
        return await this.blockChainService.update(blockChainDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update blockChain with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: BlockChainDTO,
    })
    async putId(@Req() req: Request, @Body() blockChainDTO: BlockChainDTO): Promise<BlockChainDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'BlockChain', blockChainDTO.id);
        return await this.blockChainService.update(blockChainDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete blockChain' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'BlockChain', id);
        return await this.blockChainService.deleteById(id);
    }
}
