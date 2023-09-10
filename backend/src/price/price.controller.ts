import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { PriceService } from './price.service';
import { Price } from './price.entity';
import { NewProductDTO } from './dto/new-product.dto';
import { PriceChangeDTO } from './dto/price-change.dto';
import { CreatePriceDTO } from './dto/create-price.dto';
import { ProductEventDTO } from './dto/product-event.dto';

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

  @Get('product-events/:productId')
  getProductEvents(
    @Param('productId') productId: string,
  ): Promise<ProductEventDTO[]> {
    return this.priceService.getProductEvents(productId);
  }

  @Get('new-products/:seller')
  getNewProducts(
    @Param('seller') seller: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ): Promise<NewProductDTO[]> {
    const { fromDateParsed, toDateParsed } = this.parseDates(fromDate, toDate);
    return this.priceService.findNewProducts(
      seller,
      fromDateParsed,
      toDateParsed,
    );
    // return this.priceService.getNewProducts(
    //   seller,
    //   fromDateParsed,
    //   toDateParsed,
    // );
  }

  @Get('price-changes/:seller')
  getPriceChanges(
    @Param('seller') seller: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ): Promise<PriceChangeDTO[]> {
    const { fromDateParsed, toDateParsed } = this.parseDates(fromDate, toDate);
    return this.priceService.getPriceChanges(
      seller,
      fromDateParsed,
      toDateParsed,
    );
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
  async getPricesByProductIds(
    @Body() productIds: string[],
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    const { fromDateParsed, toDateParsed } = this.parseDates(fromDate, toDate);
    const grouppedPrices =
      fromDate && toDate
        ? await this.priceService.getPricesByProductIds(
            productIds,
            fromDateParsed,
            toDateParsed,
          )
        : await this.priceService.getPricesByProductIds(productIds);
    const response = {};
    grouppedPrices.forEach((prices: CreatePriceDTO[], productId: string) => {
      response[productId] = prices;
    });
    return response;
  }

  private parseDates(
    fromDate: string,
    toDate: string,
  ): { fromDateParsed: Date; toDateParsed: Date } {
    const today = new Date();
    let toDateParsed = today;
    if (toDate) {
      toDateParsed = new Date(toDate);
    }
    let fromDateParsed = new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000); // 8 days ago
    if (fromDate) {
      fromDateParsed = new Date(fromDate);
    }
    return { fromDateParsed, toDateParsed };
  }
}
