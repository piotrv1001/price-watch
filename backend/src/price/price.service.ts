import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
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

  async findByProductIdAndDates(
    productId: string,
    fromDate: Date,
    toDate: Date,
  ): Promise<Price[]> {
    return await this.priceRepository.find({
      where: {
        productId: productId,
        date: Between(fromDate, toDate),
      },
    });
  }

  async getNewProducts(
    seller: string,
    fromDate: Date,
    toDate: Date,
  ): Promise<NewProductDTO[]> {
    return await this.analyzePriceChanges(seller, fromDate, toDate, true);
  }

  async getPriceChanges(
    seller: string,
    fromDate: Date,
    toDate: Date,
  ): Promise<PriceChangeDTO[]> {
    return await this.analyzePriceChanges(seller, fromDate, toDate, false);
  }

  async getPricesByProductIds(
    productIds: string[],
    fromDate?: Date,
    toDate?: Date,
  ): Promise<Map<string, number[]>> {
    const pricesByProductId = new Map<string, number[]>();
    for (const productId of productIds) {
      const prices =
        fromDate && toDate
          ? await this.findByProductId(productId)
          : await this.findByProductIdAndDates(productId, fromDate, toDate);
      pricesByProductId.set(
        productId,
        prices.map((price: Price) => price.price),
      );
    }
    return pricesByProductId;
  }

  private async analyzePriceChanges(
    seller: string,
    fromDate: Date,
    toDate: Date,
    returnNewProducts: boolean,
  ): Promise<PriceChangeDTO[] | NewProductDTO[]> {
    const query = this.priceRepository
      .createQueryBuilder('p')
      .select('p.*')
      .addSelect('pr.name as name')
      .addSelect('pr.imgSrc as imgSrc')
      .addSelect('pr.promo as promo')
      .addSelect('pr.link as link')
      .innerJoin('p.product', 'pr')
      .where('pr.seller = :seller', { seller })
      .andWhere('p.date >= :fromDate', { fromDate })
      .andWhere('p.date <= :toDate', { toDate })
      .orderBy('p.date', 'DESC')
      .orderBy('p.id', 'DESC')
      .addOrderBy('p.productId');

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
          promo: curr.promo,
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
          promo: product.promo,
          currentPrice: prices[0].price,
        });
        return {
          productId: product.productId,
          name: product.name,
          imgSrc: product.imgSrc,
          link: product.link,
          promo: product.promo,
          prevPrice: null,
          currentPrice: prices[0].price,
          priceChange: null,
          priceChangePercentage: null,
        };
      } else {
        const lastIndex = prices.length - 1;
        const priceChange = prices[0].price - prices[lastIndex].price;
        return {
          productId: product.productId,
          name: product.name,
          imgSrc: product.imgSrc,
          link: product.link,
          promo: product.promo,
          prevPrice: prices[lastIndex].price,
          currentPrice: prices[0].price,
          priceChange,
          priceChangePercentage: (priceChange / prices[lastIndex].price) * 100,
        };
      }
    });
    const filteredPriceChanges = priceChanges.filter(
      (item) => item.priceChange !== null && item.priceChange !== 0,
    );
    const priceChangesSorted = filteredPriceChanges.sort((a, b) => {
      if (a.priceChangePercentage === null) return 1;
      if (b.priceChangePercentage === null) return -1;
      return (
        Math.abs(b.priceChangePercentage) - Math.abs(a.priceChangePercentage)
      );
    });
    return returnNewProducts ? newProducts : priceChangesSorted;
  }
}
