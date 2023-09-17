import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { Product } from 'src/product/product.entity';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly productService: ProductService,
  ) {}

  async getUserFromRequest(user: any): Promise<User | null> {
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

  async getByEmailNoGoogleUser(email: string): Promise<User> {
    return this.userRepository.findOneBy({
      email: email,
      u_id: null,
    });
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

  async findFavoriteProductsByUserId(userId: number): Promise<any[]> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.favoriteProducts', 'favoriteProducts')
      .where('user.id = :userId', { userId })
      .getOne();
    if (!user) {
      return null;
    }
    const result: any[] = [];
    for (const product of user.favoriteProducts) {
      const currentProduct = await this.productService.findById(product.id);
      const currentPrice = this.productService.getCurrentPrice(
        currentProduct.prices,
      );
      result.push({ ...product, currentPrice });
    }
    return result;
  }

  async addNewFavoriteProduct(
    userId: number,
    productId: string,
  ): Promise<any[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favoriteProducts'],
    });
    const product = await this.productService.findById(productId);
    if (!user || !product) {
      return null;
    }
    const currentPrice = this.productService.getCurrentPrice(product.prices);
    user.favoriteProducts.push(product);
    await this.userRepository.save(user);
    return user.favoriteProducts.map((p) => ({ ...p, currentPrice }));
  }

  async deleteFavoriteProduct(
    userId: number,
    productId: string,
  ): Promise<Product[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favoriteProducts'],
    });
    const product = await this.productService.findById(productId);
    if (!user || !product) {
      return null;
    }
    const currentPrice = this.productService.getCurrentPrice(product.prices);
    user.favoriteProducts = user.favoriteProducts.filter(
      (favoriteProduct) => favoriteProduct.id != product.id,
    );
    await this.userRepository.save(user);
    return user.favoriteProducts.map((p) => ({ ...p, currentPrice }));
  }

  async updateRtHash(
    userId: number,
    refreshToken: string | null,
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      return;
    }
    if (refreshToken) {
      const salt = await bcrypt.genSalt(10);
      const newRtHash = await bcrypt.hash(refreshToken, salt);
      user.rtHash = newRtHash;
    } else {
      user.rtHash = refreshToken;
    }
    await this.userRepository.save(user);
  }

  async getUserByIdWithNullRtHash(userId: number): Promise<User> {
    return this.userRepository.findOneBy({
      id: userId,
      rtHash: null,
    });
  }
}
