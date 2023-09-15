import { EmailConfig } from 'src/email-config/email-config.entity';
import { Filter } from 'src/filter/filter.entity';
import { Product } from 'src/product/product.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  u_id?: string;

  @Column({ nullable: true })
  profilePic?: string;

  @Column({ nullable: true })
  displayName?: string;

  @OneToOne(() => EmailConfig, { nullable: true })
  emailConfig?: EmailConfig;

  @OneToMany(() => Filter, (filter) => filter.user, {
    nullable: true,
  })
  filters?: Relation<Filter[]>;

  @ManyToMany(() => Product)
  @JoinTable({ name: 'favorite_products' })
  favoriteProducts?: Product[];
}
