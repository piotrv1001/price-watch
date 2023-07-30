import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { PriceService } from './price.service';
import { Price } from './price.entity';

@Controller('prices')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get()
  findAll(): Promise<Price[]> {
    return this.priceService.findAll();
  }

  @Get('product/:productId')
  findByProductId(@Param('productId') productId: string): Promise<Price[]> {
    return this.priceService.findByProductId(productId);
  }

  @Get(':id')
  findById(@Param('id') id: number): Promise<Price> {
    return this.priceService.findById(id);
  }

  @Post()
  create(@Body() priceDto: Price): Promise<Price> {
    return this.priceService.create(priceDto);
  }

  @Put()
  update(@Body() priceDto: Price): Promise<Price> {
    return this.priceService.update(priceDto);
  }

  @Delete(':id')
  deleteById(@Param('id') id: number): Promise<void> {
    return this.priceService.deleteById(id);
  }

  @Post('by-product-ids')
  async getPricesByProductIds(@Body() productIds: string[]) {
    const grouppedPrices = await this.priceService.getPricesByProductIds(
      productIds,
    );
    const response = {};
    grouppedPrices.forEach((prices: number[], productId: string) => {
      response[productId] = prices;
    });
    return response;
  }
}
