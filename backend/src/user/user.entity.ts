import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: true })
  username?: string;

  @Column({ nullable: true })
  password?: string;
}
