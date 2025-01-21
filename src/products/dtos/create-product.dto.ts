import { IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Product Name', description: 'The name of the product' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'This is a great product', description: 'A brief description of the product' })
  @IsString()
  description: string;

  @ApiProperty({ example: 100.0, description: 'The price of the product in USD', minimum: 0 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 50, description: 'The available stock of the product', minimum: 0 })
  @IsNumber()
  @Min(0)
  stock: number;
}
