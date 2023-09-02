import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { CreateProductDTO } from './dto/create-product.dto';
import { Price } from 'src/price/price.entity';
import { Bucket } from 'src/bucket';

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
    return await this.productRepository.save(product);
  }

  async update(createProductDTO: CreateProductDTO): Promise<Product> {
    const id = createProductDTO.id;
    const product = await this.productRepository.findOneBy({ id });
    product.name = createProductDTO.name;
    product.seller = createProductDTO.seller;
    product.link = createProductDTO.link;
    product.imgSrc = createProductDTO.imgSrc;
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

  async getPriceBuckets(seller: string): Promise<number[]> {
    const products = await this.findBySeller(seller);
    const productWithCurrentPrice = products.map((product) => ({
      ...product,
      currentPrice: this.getCurrentPrice(product.prices),
    }));
    return this.groupProducts(productWithCurrentPrice);
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
    return pricesSortedByDate[0].price;
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
