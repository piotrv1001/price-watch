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

  async getUser(user: any): Promise<User | null> {
    const uId = user?.uid;
    if (uId != null) {
      return await this.getByUId(uId);
    }
    const id = user?.sub;
    if (id != null) {
      return await this.getById(id);
    }
    return null;
  }

  async create(createUserDTO: CreateUserDto): Promise<User> {
    const user = new User();
    user.u_id = createUserDTO.u_id;
    user.email = createUserDTO.email;
    if (createUserDTO.password == null) {
      user.password = null;
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(createUserDTO.password, salt);
      user.password = hashedPassword;
    }
    if (createUserDTO.displayName) {
      user.displayName = createUserDTO.displayName;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...newUser } = await this.userRepository.save(user);
    return newUser;
  }

  async getByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email: email });
  }

  async getById(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id: id });
  }

  async getByUId(u_id: string): Promise<User> {
    return this.userRepository.findOneBy({ u_id: u_id });
  }

  async partialUpdate(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
}
