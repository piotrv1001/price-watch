import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { In, Repository } from 'typeorm';
import { CreateProductDTO } from './dto/create-product.dto';
import { Price } from 'src/price/price.entity';
import { Bucket } from 'src/bucket';
import { ProductFilterDTO } from './dto/product-filter';
import { SellerInfoDTO } from 'src/price/dto/seller-info.dto';
import { ProductWithPrice } from 'src/price/dto/product-with-price';
import { PriceService } from 'src/price/price.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly priceService: PriceService,
  ) {}

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async findById(id: string): Promise<Product> {
    return await this.productRepository.findOne({
      where: { id: id },
      relations: ['prices'],
    });
  }

  async getSellerInfo(seller: string): Promise<SellerInfoDTO> {
    const totalPromise = this.getProductCountBySeller(seller);
    const promotedPromise = this.getProductPromoCountBySeller(seller);
    const dominantBucketPromise = this.getMostDominantBucketBySeller(seller);
    const bestSellingProductsPromise =
      this.getBestSellingProductsBySeller(seller);
    const mostExpensiveProductPromise =
      this.getMostExpensiveProductBySeller(seller);
    const leastExpensiveProductPromise =
      this.getLeastExpensiveProductBySeller(seller);
    const averagePricePromise =
      this.priceService.getAveragePriceBySeller(seller);
    const results = await Promise.allSettled([
      totalPromise,
      promotedPromise,
      dominantBucketPromise,
      bestSellingProductsPromise,
      mostExpensiveProductPromise,
      leastExpensiveProductPromise,
      averagePricePromise,
    ]);
    const total =
      results[0].status === 'fulfilled' ? results[0].value : undefined;
    const promoted =
      results[1].status === 'fulfilled' ? results[1].value : undefined;
    const dominantBucket =
      results[2].status === 'fulfilled' ? results[2].value : undefined;
    const bestSellingProducts =
      results[3].status === 'fulfilled' ? results[3].value : undefined;
    const mostExpensiveProduct =
      results[4].status === 'fulfilled' ? results[4].value : undefined;
    const leastExpensiveProduct =
      results[5].status === 'fulfilled' ? results[5].value : undefined;
    const averagePrice =
      results[6].status === 'fulfilled' ? results[6].value : undefined;
    return {
      total,
      promoted,
      dominantBucket,
      averagePrice,
      bestSellingProducts,
      mostExpensiveProduct,
      leastExpensiveProduct,
    };
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

  async getProductCountBySeller(seller: string): Promise<number> {
    return this.productRepository
      .createQueryBuilder('product')
      .where('product.seller = :seller', { seller })
      .getCount();
  }

  async getProductPromoCountBySeller(seller: string): Promise<number> {
    return this.productRepository
      .createQueryBuilder('product')
      .where('product.seller = :seller', { seller })
      .andWhere('product.promo = 1')
      .getCount();
  }

  async getMostDominantBucketBySeller(seller: string): Promise<Bucket> {
    const products = await this.findBySeller(seller);
    const productWithCurrentPrice = products.map((product) => ({
      currentPrice: this.getCurrentPrice(product.prices),
    }));
    const grouppedProducts = this.groupProducts(productWithCurrentPrice);
    const max = Math.max(...grouppedProducts);
    return grouppedProducts.indexOf(max);
  }

  async getBestSellingProductsBySeller(
    seller: string,
    limit = 3,
  ): Promise<ProductWithPrice[]> {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .where('product.seller = :seller', { seller })
      .orderBy('product.numberOfPeople', 'DESC')
      .limit(limit)
      .getMany();

    const result: ProductWithPrice[] = [];
    for (const product of products) {
      const productWithPrices = await this.findById(product.id);
      result.push({
        ...product,
        currentPrice: this.getCurrentPrice(productWithPrices.prices),
      });
    }
    return result;
  }

  async getMostExpensiveProductBySeller(
    seller: string,
  ): Promise<ProductWithPrice> {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .innerJoin('product.prices', 'price')
      .where('product.seller = :seller', { seller })
      .orderBy('price.price', 'DESC')
      .limit(1)
      .getOne();

    const productWithPrices = await this.findById(product.id);
    const result = {
      ...product,
      currentPrice: this.getCurrentPrice(productWithPrices.prices),
    };
    return result;
  }

  async getLeastExpensiveProductBySeller(
    seller: string,
  ): Promise<ProductWithPrice> {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .innerJoin('product.prices', 'price')
      .where('product.seller = :seller', { seller })
      .orderBy('price.price', 'ASC')
      .limit(1)
      .getOne();

    const productWithPrices = await this.findById(product.id);
    const result = {
      ...product,
      currentPrice: this.getCurrentPrice(productWithPrices.prices),
    };
    return result;
  }

  async filter(productFilter: ProductFilterDTO): Promise<any[]> {
    const {
      sellers,
      statusList,
      minPrice,
      maxPrice,
      minBuyers,
      maxBuyers,
      promo,
      priceChangesOnly,
      newProductsOnly,
    } = productFilter;

    const queryBuilder = this.productRepository.createQueryBuilder('product');
    queryBuilder.where({
      seller: In(sellers),
      status: In(statusList),
    });
    queryBuilder.leftJoinAndSelect('product.prices', 'prices');

    const filteredProducts = (await queryBuilder.getMany()) as any[];

    for (const product of filteredProducts) {
      product.currentPrice = this.getCurrentPrice(product.prices);
      if (priceChangesOnly) {
        product.didPriceChange = await this.didPriceEverChange(product.prices);
      }
      if (newProductsOnly) {
        product.isNew = await this.isNewProduct(product.prices);
      }
    }

    const finalFilteredProducts = filteredProducts.filter((product) => {
      const price = product.currentPrice;
      const numberOfPeople = product.numberOfPeople;
      return (
        (!minPrice || price >= minPrice) &&
        (!maxPrice || price <= maxPrice) &&
        (!promo ||
          promo === 'all' ||
          (promo === 'promo' && product.promo) ||
          (promo === 'non-promo' && !product.promo)) &&
        (!priceChangesOnly || product.didPriceChange) &&
        (!newProductsOnly || product.isNew) &&
        (!minBuyers || !numberOfPeople || numberOfPeople >= minBuyers) &&
        (!maxBuyers || !numberOfPeople || numberOfPeople <= maxBuyers)
      );
    });

    return finalFilteredProducts.map((product) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { prices, ...rest } = product;
      return rest;
    });
  }

  async getPriceBuckets(seller: string): Promise<number[]> {
    const products = await this.findBySeller(seller);
    const productWithCurrentPrice = products.map((product) => ({
      currentPrice: this.getCurrentPrice(product.prices),
    }));
    return this.groupProducts(productWithCurrentPrice);
  }

  getCurrentPrice(prices: Price[] | undefined): number | undefined {
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

  private async isNewProduct(prices: Price[]): Promise<boolean> {
    if (!prices || prices.length === 0) {
      return false;
    }
    const pricesSortedByDate = prices.sort((a, b) => {
      const aDate = this.getDate(a.date);
      const bDate = this.getDate(b.date);
      if (aDate && bDate) {
        return bDate.getTime() - aDate.getTime();
      }
      return 0;
    });
    const firstPriceDate = this.getDate(pricesSortedByDate[0].date);
    const lastPriceDate = this.getDate(
      pricesSortedByDate[pricesSortedByDate.length - 1].date,
    );
    if (firstPriceDate && lastPriceDate) {
      const timeDiff = Math.abs(
        firstPriceDate.getTime() - lastPriceDate.getTime(),
      );
      const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return diffDays <= 7;
    }
    return false;
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

  private getDate(date: string | Date | undefined): Date | null {
    if (typeof date === 'string') {
      return new Date(date);
    } else if (date instanceof Date) {
      return date;
    }
    return null;
  }
}
