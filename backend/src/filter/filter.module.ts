import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Filter } from './filter.entity';
import { FilterService } from './filter.service';
import { FilterController } from './filter.controller';
import { UsersModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Filter]), UsersModule],
  providers: [FilterService],
  controllers: [FilterController],
})
export class FilterModule {}
