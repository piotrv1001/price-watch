import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, PrimaryColumn, Relation } from 'typeorm';

@Entity({ name: 'filter' })
export class Filter {
  @PrimaryColumn()
  id?: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  jsonFilter?: string;

  @ManyToOne(() => User, (user) => user.filters)
  user?: Relation<User>;

  @Column({ nullable: true })
  userId?: number;
}
