import { Column, Entity, PrimaryColumn } from 'typeorm';

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
}
