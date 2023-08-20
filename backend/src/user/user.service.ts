import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDTO: CreateUserDto): Promise<User> {
    const user = new User();
    user.u_id = createUserDTO.u_id;
    user.username = createUserDTO.username;
    if (createUserDTO.password == null) {
      user.password = null;
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(createUserDTO.password, salt);
      user.password = hashedPassword;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...newUser } = await this.userRepository.save(user);
    return newUser;
  }

  async getByUsername(username: string): Promise<User> {
    return this.userRepository.findOneBy({ username: username });
  }

  async getByUId(u_id: string): Promise<User> {
    return this.userRepository.findOneBy({ u_id: u_id });
  }
}
