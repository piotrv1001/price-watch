import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'password_reset' })
export class PasswordReset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ unique: true })
  token: string;
}
