import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { ProductsService } from './product.service';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../users/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';

@Controller('products')
@ApiTags('Products')  // Tagging for Swagger UI
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post('')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid product data.' })
  @ApiBody({
    description: 'Product data to create a new product.',
    type: CreateProductDto,
  })
  @ApiBearerAuth()  // Adding authorization header for authenticated requests
  createProduct(@Body() body: CreateProductDto) {
    return this.productsService.create(body);
  }

  @Get('')
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'List of all products.' })
  @ApiResponse({ status: 404, description: 'Products not found.' })
  findAllProducts() {
    return this.productsService.find();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get a product by its ID' })
  @ApiResponse({ status: 200, description: 'Product details.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiParam({ name: 'id', type: Number, description: 'The ID of the product' })
  findProduct(@Param('id') id: number) {
    return this.productsService.findOne(id);
  }

  @Put('/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update an existing product' })
  @ApiResponse({ status: 200, description: 'Product updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid product data.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiParam({ name: 'id', type: Number, description: 'The ID of the product' })
  @ApiBody({
    description: 'Product data to update an existing product.',
    type: CreateProductDto,
  })
  @ApiBearerAuth()  // Adding authorization header for authenticated requests
  updateProduct(
    @Param('id') id: number,
    @Body() body: Partial<CreateProductDto>,
  ) {
    return this.productsService.update(id, body);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete a product by its ID' })
  @ApiResponse({ status: 204, description: 'Product deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiParam({ name: 'id', type: Number, description: 'The ID of the product' })
  @ApiBearerAuth()  // Adding authorization header for authenticated requests
  @HttpCode(204) // No Content
  async deleteProduct(@Param('id') id: number): Promise<void> {
    await this.productsService.remove(id);
  }
}
