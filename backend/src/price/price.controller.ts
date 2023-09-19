import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PriceService } from './price.service';
import { Price } from './price.entity';
import { NewProductDTO } from './dto/new-product.dto';
import { PriceChangeDTO } from './dto/price-change.dto';
import { CreatePriceDTO } from './dto/create-price.dto';
import { ProductEventDTO } from './dto/product-event.dto';
import { CombinedAuthGuard } from 'src/auth/guards/combined-auth.guard';

@Controller('prices')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @UseGuards(CombinedAuthGuard)
  @Get()
  findAll(): Promise<Price[]> {
    return this.priceService.findAll();
  }

  @UseGuards(CombinedAuthGuard)
  @Get('product/:productId')
  findByProductId(@Param('productId') productId: string): Promise<Price[]> {
    return this.priceService.findByProductId(productId);
  }

  @UseGuards(CombinedAuthGuard)
  @Get(':id')
  findById(@Param('id') id: number): Promise<Price> {
    return this.priceService.findById(id);
  }

  @UseGuards(CombinedAuthGuard)
  @Get('product-events/:productId')
  getProductEvents(
    @Param('productId') productId: string,
  ): Promise<ProductEventDTO[]> {
    return this.priceService.getProductEvents(productId);
  }

  @UseGuards(CombinedAuthGuard)
  @Get('new-products/:seller')
  getNewProducts(
    @Param('seller') seller: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('limit') limit?: number,
  ): Promise<NewProductDTO[]> {
    const { fromDateParsed, toDateParsed } = this.parseDates(fromDate, toDate);
    return this.priceService.findNewProducts(
      seller,
      fromDateParsed,
      toDateParsed,
      limit,
    );
  }

  @UseGuards(CombinedAuthGuard)
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

  @UseGuards(CombinedAuthGuard)
  @Post()
  create(@Body() priceDto: Price): Promise<Price> {
    return this.priceService.create(priceDto);
  }

  @UseGuards(CombinedAuthGuard)
  @Put()
  update(@Body() priceDto: Price): Promise<Price> {
    return this.priceService.update(priceDto);
  }

  @UseGuards(CombinedAuthGuard)
  @Delete(':id')
  deleteById(@Param('id') id: number): Promise<void> {
    return this.priceService.deleteById(id);
  }

  @UseGuards(CombinedAuthGuard)
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
