import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordsController } from '../web/rest/records.controller';
import { RecordsRepository } from '../repository/records.repository';
import { RecordsService } from '../service/records.service';

@Module({
    imports: [TypeOrmModule.forFeature([RecordsRepository])],
    controllers: [RecordsController],
    providers: [RecordsService],
    exports: [RecordsService],
})
export class RecordsModule {}
