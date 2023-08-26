import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'email_config' })
export class EmailConfig {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  dayOfWeek?: number;

  @Column({ nullable: true })
  hour?: number;

  @Column({ nullable: true })
  minute?: number;

  @Column({ type: 'tinyint', width: 1, default: 0, nullable: true })
  enabled?: boolean;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ nullable: true })
  userId?: number;
}
