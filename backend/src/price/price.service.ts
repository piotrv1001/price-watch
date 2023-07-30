import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Price } from './price.entity';
import { CreatePriceDTO } from './dto/create-price.dto';
import { PriceChangeDTO } from './dto/price-change.dto';
import { NewProductDTO } from './dto/new-product.dto';

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

  async getNewProducts(seller: string): Promise<NewProductDTO[]> {
    return await this.analyzePriceChanges(seller, true);
  }

  async getPriceChanges(seller: string): Promise<PriceChangeDTO[]> {
    return await this.analyzePriceChanges(seller, false);
  }

  private async analyzePriceChanges(
    seller: string,
    returnNewProducts: boolean,
  ): Promise<PriceChangeDTO[] | NewProductDTO[]> {
    const query = this.priceRepository
      .createQueryBuilder('p')
      .select('p.*')
      .addSelect('pr.name as name')
      .addSelect('pr.imgSrc as imgSrc')
      .addSelect('pr.link as link')
      .innerJoin('p.product', 'pr')
      .innerJoin(
        (subQuery) =>
          subQuery
            .select('DISTINCT date')
            .from(Price, 'price')
            .orderBy('date', 'DESC')
            .limit(2),
        'subquery',
        'p.date = subquery.date',
      )
      .where('pr.seller = :seller', { seller })
      .orderBy('p.productId')
      .addOrderBy('p.date', 'DESC');

    const results = await query.getRawMany();
    const products = results.reduce((acc, curr) => {
      const product = acc.find((p: any) => p.productId === curr.productId);
      if (product) {
        product.prices.push(curr);
      } else {
        acc.push({
          productId: curr.productId,
          name: curr.name,
          imgSrc: curr.imgSrc,
          link: curr.link,
          prices: [curr],
        });
      }
      return acc;
    }, []);
    const newProducts = [];
    const priceChanges = products.map((product) => {
      const { prices } = product;
      if (prices.length < 2) {
        // New product detected, because we only have 1 price
        newProducts.push({
          productId: product.productId,
          name: product.name,
          imgSrc: product.imgSrc,
          link: product.link,
          currentPrice: prices[0].price,
        });
        return {
          productId: product.productId,
          name: product.name,
          imgSrc: product.imgSrc,
          link: product.link,
          prevPrice: null,
          currentPrice: prices[0].price,
          priceChange: null,
          priceChangePercentage: null,
        };
      } else {
        const priceChange = prices[0].price - prices[1].price;
        return {
          productId: product.productId,
          name: product.name,
          imgSrc: product.imgSrc,
          link: product.link,
          prevPrice: prices[1].price,
          currentPrice: prices[0].price,
          priceChange,
          priceChangePercentage: (priceChange / prices[1].price) * 100,
        };
      }
    });
    const filteredPriceChanges = priceChanges.filter(
      (item) => item.priceChange !== null && item.priceChange !== 0,
    );
    const priceChangesSorted = filteredPriceChanges.sort((a, b) => {
      if (a.priceChange === null) return 1;
      if (b.priceChange === null) return -1;
      return Math.abs(b.priceChange) - Math.abs(a.priceChange);
    });
    return returnNewProducts ? newProducts : priceChangesSorted;
  }
}
