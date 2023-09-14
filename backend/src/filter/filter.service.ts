import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Filter } from './filter.entity';
import { Repository } from 'typeorm';
import { CreateFilterDTO } from './dto/create-filter.dto';

@Injectable()
export class FilterService {
  constructor(
    @InjectRepository(Filter)
    private readonly filterRepository: Repository<Filter>,
  ) {}

  async create(
    createFilterDTO: CreateFilterDTO,
    userId: number,
  ): Promise<Filter> {
    const filter = new Filter();
    filter.name = createFilterDTO.name;
    filter.jsonFilter = createFilterDTO.jsonFilter;
    filter.userId = userId;
    return this.filterRepository.save(filter);
  }

  async getByUserId(userId: number): Promise<Filter[]> {
    return this.filterRepository.findBy({ userId });
  }

  async deleteById(id: string): Promise<void> {
    await this.filterRepository.delete({ id });
  }
}
