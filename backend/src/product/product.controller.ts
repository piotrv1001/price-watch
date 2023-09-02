import {
  Body,
  Controller,
  Param,
  Get,
  Post,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { CreateProductDTO } from './dto/create-product.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AuthGuard)
  @Get()
  findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('price-buckets/:seller')
  getPriceBuckets(@Param('seller') seller: string): Promise<number[]> {
    return this.productService.getPriceBuckets(seller);
  }

  @UseGuards(AuthGuard)
  @Get('seller/:seller')
  findBySeller(@Param('seller') seller: string): Promise<Product[]> {
    return this.productService.findBySeller(seller);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findById(@Param('id') id: string): Promise<Product> {
    return this.productService.findById(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createProductDTO: CreateProductDTO): Promise<Product> {
    return this.productService.create(createProductDTO);
  }

  @UseGuards(AuthGuard)
  @Put()
  update(@Body() createProductDTO: CreateProductDTO): Promise<Product> {
    return this.productService.update(createProductDTO);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteById(@Param('id') id: string): Promise<void> {
    return this.productService.deleteById(id);
  }
}
