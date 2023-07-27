import { Price } from 'src/price/price.entity';
import { Column, Entity, OneToMany, PrimaryColumn, Relation } from 'typeorm';

@Entity({ name: 'product' })
export class Product {
  @PrimaryColumn()
  id?: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  seller?: string;

  @Column({ nullable: true })
  link?: string;

  @Column({ nullable: true })
  imgSrc?: string;

  @OneToMany(() => Price, (price) => price.product, {
    nullable: true,
  })
  prices?: Relation<Price[]>;
}
