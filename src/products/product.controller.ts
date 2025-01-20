import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { ProductsService } from './product.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/users/decorators/roles.decorator';
import { HttpCode } from '@nestjs/common';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post('')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  createProduct(@Body() body: CreateProductDto) {
    return this.productsService.create(body);
  }

  @Get('')
  findAllProducts() {
    return this.productsService.find();
  }

  @Get('/:id')
  findProduct(@Param('id') id: number) {
    return this.productsService.findOne(id);
  }

  @Put('/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  updateProduct(
    @Param('id') id: number,
    @Body() body: Partial<CreateProductDto>,
  ) {
    return this.productsService.update(id, body);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(204) // No Content
  async deleteProduct(@Param('id') id: number): Promise<void> {
    await this.productsService.remove(id);
  }
}
