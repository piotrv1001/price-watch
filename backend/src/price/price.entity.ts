import { Product } from 'src/product/product.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity({ name: 'price' })
export class Price {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: true })
  price?: number;

  @Column({ nullable: true, type: 'datetime' })
  date?: Date;

  @ManyToOne(() => Product, (product) => product.prices)
  product?: Relation<Product>;

  @Column({ nullable: true })
  productId?: string;
}
