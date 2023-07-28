import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { CreateProductDTO } from './dto/create-product.dto';

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
}
