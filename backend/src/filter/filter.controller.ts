import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  Res,
  UseGuards,
  Body,
} from '@nestjs/common';
import { FilterService } from './filter.service';
import { UserService } from 'src/user/user.service';
import { Filter } from './filter.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CreateFilterDTO } from './dto/create-filter.dto';

@Controller('filters')
export class FilterController {
  constructor(
    private readonly filterService: FilterService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Request() req,
    @Res() res,
    @Body() createFilterDTO: CreateFilterDTO,
  ) {
    const user = await this.userService.getUserFromRequest(req.user);
    if (user == null) {
      return res.status(404).send();
    } else {
      await this.filterService.create(createFilterDTO, user.id);
      return res.status(201).send();
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  async findByUserId(@Request() req, @Res() res): Promise<Filter[]> {
    const user = await this.userService.getUserFromRequest(req.user);
    if (user == null) {
      return res.status(404).send();
    } else {
      const filters = await this.filterService.getByUserId(user.id);
      return res.status(200).json(filters);
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteById(@Param('id') id: string): Promise<void> {
    return this.filterService.deleteById(id);
  }
}
