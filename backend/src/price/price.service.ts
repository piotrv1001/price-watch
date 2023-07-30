import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Price } from './price.entity';
import { CreatePriceDTO } from './dto/create-price.dto';

@Injectable()
export class PriceService {
  constructor(
    @InjectRepository(Price)
    private readonly priceRepository: Repository<Price>,
  ) {}

  async findAll(): Promise<Price[]> {
    return await this.priceRepository.find();
  }

  async findById(id: number): Promise<Price> {
    return await this.priceRepository.findOneBy({ id });
  }

  async create(createPriceDTO: CreatePriceDTO): Promise<Price> {
    const price = new Price();
    price.price = createPriceDTO.price;
    price.date = createPriceDTO.date;
    price.productId = createPriceDTO.productId;
    return await this.priceRepository.save(price);
  }

  async update(priceDto: Price): Promise<Price> {
    const id = priceDto.id;
    const price = await this.priceRepository.findOneBy({ id });
    price.price = priceDto.price;
    price.date = priceDto.date;
    price.productId = priceDto.productId;
    return await this.priceRepository.save(price);
  }

  async deleteById(id: number): Promise<void> {
    await this.priceRepository.delete({ id });
  }

  async findByProductId(productId: string): Promise<Price[]> {
    return await this.priceRepository.findBy({ productId });
  }

  async getPricesByProductIds(
    productIds: string[],
  ): Promise<Map<string, number[]>> {
    const pricesByProductId = new Map<string, number[]>();
    for (const productId of productIds) {
      const prices = await this.findByProductId(productId);
      pricesByProductId.set(
        productId,
        prices.map((price: Price) => price.price),
      );
    }
    return pricesByProductId;
  }
}
