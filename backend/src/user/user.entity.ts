import { EmailConfig } from 'src/email-config/email-config.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

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
}
