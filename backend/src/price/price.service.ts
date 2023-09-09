import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Price } from './price.entity';
import { CreatePriceDTO } from './dto/create-price.dto';
import { PriceChangeDTO } from './dto/price-change.dto';
import { NewProductDTO } from './dto/new-product.dto';
import { ProductEventDTO } from './dto/product-event.dto';

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
    return await this.priceRepository.find({
      where: {
        productId: productId,
      },
      order: {
        date: 'ASC',
      },
    });
  }

  async findByProductIdNested(productId: string): Promise<Price[]> {
    return await this.priceRepository.find({
      where: {
        productId: productId,
      },
      order: {
        date: 'ASC',
      },
      relations: ['product'],
    });
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
      order: {
        date: 'ASC',
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
  ): Promise<Map<string, CreatePriceDTO[]>> {
    const pricesByProductId = new Map<string, CreatePriceDTO[]>();
    for (const productId of productIds) {
      const prices =
        fromDate && toDate
          ? await this.findByProductIdAndDates(productId, fromDate, toDate)
          : await this.findByProductId(productId);
      const mappedPrices = prices.map((price: Price) => {
        return {
          productId: price.productId,
          date: price.date,
          price: price.price,
        };
      });
      const filledPrices = this.fillMissingDates(
        fromDate,
        toDate,
        mappedPrices,
      );
      pricesByProductId.set(productId, filledPrices);
    }
    return pricesByProductId;
  }

  async getProductEvents(productId: string): Promise<ProductEventDTO[]> {
    const prices = await this.findByProductIdNested(productId);
    const events: ProductEventDTO[] = [];
    let hasLaunched = false;
    let hasBeenWithdrawn = false;
    let i = 0;
    for (const price of prices) {
      if (!hasLaunched) {
        events.push({
          type: 'new-product',
          currentPrice: price.price,
          date: price.date,
          imgSrc: price.product.imgSrc,
        });
        hasLaunched = true;
      } else {
        if (hasBeenWithdrawn) {
          events.push({
            type: 're-activated',
            currentPrice: price.price,
            date: price.date,
          });
          hasBeenWithdrawn = false;
        } else if (i > 0 && prices[i - 1].price !== price.price) {
          const priceChange = price.price - prices[i - 1].price;
          events.push({
            type: 'price-change',
            prevPrice: prices[i - 1].price,
            currentPrice: price.price,
            priceChangePercentage: Math.round(
              (priceChange / prices[i - 1].price) * 100,
            ),
            date: price.date,
          });
        }
      }
      if (i === prices.length - 1) {
        const today = new Date();
        const lastDate = new Date(price.date);
        const day = 24 * 60 * 60 * 1000;
        if (today.getTime() - lastDate.getTime() > 14 * day) {
          events.push({
            type: 'withdrawn',
            currentPrice: price.price,
            date: lastDate,
          });
        }
      } else {
        const nextDate = new Date(prices[i + 1].date);
        const lastDate = new Date(price.date);
        const day = 24 * 60 * 60 * 1000;
        if (nextDate.getTime() - lastDate.getTime() > 14 * day) {
          events.push({
            type: 'withdrawn',
            currentPrice: price.price,
            date: lastDate,
          });
          hasBeenWithdrawn = true;
        }
      }
      i++;
    }
    return events;
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
      .addSelect('pr.status as status')
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
          status: curr.status,
          link: curr.link,
          seller,
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
          status: product.status,
          seller,
          currentPrice: prices[0].price,
        });
        return {
          productId: product.productId,
          name: product.name,
          imgSrc: product.imgSrc,
          link: product.link,
          promo: product.promo,
          status: product.status,
          prevPrice: null,
          currentPrice: prices[0].price,
          priceChange: null,
          seller,
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
          status: product.status,
          prevPrice: prices[lastIndex].price,
          currentPrice: prices[0].price,
          priceChange,
          seller,
          priceChangePercentage: Math.round(
            (priceChange / prices[lastIndex].price) * 100,
          ),
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

  private fillMissingDates(
    startDate: Date,
    endDate: Date,
    data: CreatePriceDTO[],
  ): CreatePriceDTO[] {
    if (data.length === 0) {
      return [];
    }
    const filledData: CreatePriceDTO[] = [];
    const maxDate = data.reduce(
      (maxDate, item) => (item.date > maxDate ? item.date : maxDate),
      data[0].date,
    );
    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);
    const dataMap = new Map<string, CreatePriceDTO>();
    data.forEach((item) =>
      dataMap.set(item.date.toISOString().substring(0, 10), item),
    );
    let prevPrice: number | undefined = undefined;
    while (currentDate <= lastDate) {
      const dateString = currentDate.toISOString().substring(0, 10);
      const existingData = dataMap.get(dateString);
      if (existingData) {
        filledData.push(existingData);
        prevPrice = existingData.price;
      } else {
        if (currentDate > maxDate) {
          prevPrice = undefined;
        }
        filledData.push({
          price: prevPrice,
          date: new Date(currentDate),
          productId: data[0].productId,
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return filledData;
  }
}
