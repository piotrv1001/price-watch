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
import { CombinedAuthGuard } from 'src/auth/guards/combined-auth.guard';
import { ProductFilterDTO } from './dto/product-filter';
import { SellerInfoDTO } from 'src/price/dto/seller-info.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(CombinedAuthGuard)
  @Get()
  findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @UseGuards(CombinedAuthGuard)
  @Post('filter')
  filter(@Body() filterDTO: ProductFilterDTO): Promise<any[]> {
    return this.productService.filter(filterDTO);
  }

  @UseGuards(CombinedAuthGuard)
  @Get('price-buckets/:seller')
  getPriceBuckets(@Param('seller') seller: string): Promise<number[]> {
    return this.productService.getPriceBuckets(seller);
  }

  // @UseGuards(CombinedAuthGuard)
  @Get('seller-info/:seller')
  getSellerInfo(@Param('seller') seller: string): Promise<SellerInfoDTO> {
    return this.productService.getSellerInfo(seller);
  }

  @UseGuards(CombinedAuthGuard)
  @Get('seller/:seller')
  findBySeller(@Param('seller') seller: string): Promise<Product[]> {
    return this.productService.findBySeller(seller);
  }

  @UseGuards(CombinedAuthGuard)
  @Get(':id')
  findById(@Param('id') id: string): Promise<Product> {
    return this.productService.findById(id);
  }

  @UseGuards(CombinedAuthGuard)
  @Post()
  create(@Body() createProductDTO: CreateProductDTO): Promise<Product> {
    return this.productService.create(createProductDTO);
  }

  @UseGuards(CombinedAuthGuard)
  @Put()
  update(@Body() createProductDTO: CreateProductDTO): Promise<Product> {
    return this.productService.update(createProductDTO);
  }

  @UseGuards(CombinedAuthGuard)
  @Delete(':id')
  deleteById(@Param('id') id: string): Promise<void> {
    return this.productService.deleteById(id);
  }
}
