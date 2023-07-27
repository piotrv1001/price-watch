import {
  Body,
  Controller,
  Param,
  Get,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { CreateProductDTO } from './dto/create-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get('seller/:seller')
  findBySeller(@Param('seller') seller: string): Promise<Product[]> {
    return this.productService.findBySeller(seller);
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<Product> {
    return this.productService.findById(id);
  }

  @Post()
  create(@Body() createProductDTO: CreateProductDTO): Promise<Product> {
    return this.productService.create(createProductDTO);
  }

  @Put()
  update(@Body() createProductDTO: CreateProductDTO): Promise<Product> {
    return this.productService.update(createProductDTO);
  }

  @Delete(':id')
  deleteById(@Param('id') id: string): Promise<void> {
    return this.productService.deleteById(id);
  }
}
