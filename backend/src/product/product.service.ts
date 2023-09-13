import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Between, In, Repository } from 'typeorm';
import { CreateProductDTO } from './dto/create-product.dto';
import { Price } from 'src/price/price.entity';
import { Bucket } from 'src/bucket';
import { ProductFilterDTO } from './dto/product-filter';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async findById(id: string): Promise<Product> {
    return await this.productRepository.findOneBy({ id });
  }

  async create(createProductDTO: CreateProductDTO): Promise<Product> {
    const product = new Product();
    product.id = createProductDTO.id;
    product.name = createProductDTO.name;
    product.seller = createProductDTO.seller;
    product.link = createProductDTO.link;
    product.imgSrc = createProductDTO.imgSrc;
    product.promo = createProductDTO.promo;
    product.status = createProductDTO.status;
    return await this.productRepository.save(product);
  }

  async update(createProductDTO: CreateProductDTO): Promise<Product> {
    const id = createProductDTO.id;
    const product = await this.productRepository.findOneBy({ id });
    product.name = createProductDTO.name;
    product.seller = createProductDTO.seller;
    product.link = createProductDTO.link;
    product.imgSrc = createProductDTO.imgSrc;
    product.promo = createProductDTO.promo;
    product.status = createProductDTO.status;
    return await this.productRepository.save(product);
  }

  async deleteById(id: string): Promise<void> {
    await this.productRepository.delete({ id });
  }

  async findBySeller(seller: string): Promise<Product[]> {
    return await this.productRepository.find({
      where: { seller },
      relations: ['prices'],
    });
  }

  async filter(productFilter: ProductFilterDTO): Promise<Product[]> {
    const {
      sellers,
      statusList,
      minPrice,
      maxPrice,
      minBuyers,
      maxBuyers,
      promo,
      priceChangesOnly,
    } = productFilter;
    const products = await this.productRepository.find({
      where: {
        seller: In(sellers),
        status: In(statusList),
        numberOfPeople: Between(minBuyers, maxBuyers),
      },
      relations: ['prices'],
    });
    const productsWithCurrentPrice = products.map((product) => ({
      ...product,
      currentPrice: this.getCurrentPrice(product.prices),
    }));
    const filteredProducts = productsWithCurrentPrice.filter(
      async (product) => {
        const price = product.currentPrice;
        let priceChangeCondition = true;
        if (priceChangesOnly) {
          priceChangeCondition = await this.didPriceEverChange(product.prices);
        }
        return (
          (!minPrice || price >= minPrice) &&
          (!maxPrice || price <= maxPrice) &&
          (!promo ||
            promo === 'all' ||
            (promo === 'promo' && product.promo) ||
            (promo === 'non-promo' && !product.promo)) &&
          priceChangeCondition
        );
      },
    );
    return filteredProducts.map((product) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { prices, ...rest } = product;
      return rest;
    });
  }

  async getPriceBuckets(seller: string): Promise<number[]> {
    const products = await this.findBySeller(seller);
    const productWithCurrentPrice = products.map((product) => ({
      ...product,
      currentPrice: this.getCurrentPrice(product.prices),
    }));
    return this.groupProducts(productWithCurrentPrice);
  }

  private async didPriceEverChange(prices: Price[]): Promise<boolean> {
    if (!prices || prices.length === 0) {
      return false;
    }
    const pricesSortedByPrice = prices.sort((a, b) => {
      return b.price - a.price;
    });
    const highestPrice = pricesSortedByPrice[0].price;
    const lowestPrice = pricesSortedByPrice[prices.length - 1].price;
    return highestPrice !== lowestPrice;
  }

  private groupProducts(products: any[]): number[] {
    const grouppedProducts: number[] = [0, 0, 0, 0];
    products.forEach((product: any) => {
      const price = product.currentPrice;
      if (price) {
        if (price < 20) {
          grouppedProducts[Bucket.CHEAP] += 1;
        } else if (price < 50) {
          grouppedProducts[Bucket.MEDIUM] += 1;
        } else if (price < 100) {
          grouppedProducts[Bucket.EXPENSIVE] += 1;
        } else {
          grouppedProducts[Bucket.VERY_EXPENSIVE] += 1;
        }
      }
    });
    return grouppedProducts;
  }

  private getCurrentPrice(prices: Price[] | undefined): number | undefined {
    if (!prices || prices.length === 0) {
      return undefined;
    }
    const pricesSortedByDate = prices.sort((a, b) => {
      const aDate = this.getDate(a.date);
      const bDate = this.getDate(b.date);
      if (aDate && bDate) {
        return bDate.getTime() - aDate.getTime();
      }
      return 0;
    });
    const price = pricesSortedByDate[0].price;
    if (typeof price === 'string') {
      return parseFloat(price);
    }
    return price;
  }

  private getDate(date: string | Date | undefined): Date | null {
    if (typeof date === 'string') {
      return new Date(date);
    } else if (date instanceof Date) {
      return date;
    }
    return null;
  }
}
