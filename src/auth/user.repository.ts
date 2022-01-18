import { EntityRepository, Repository } from 'typeorm';
import { SignUpDto } from './dto/signup.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(signUpDto: SignUpDto) {
    const { name, email, password } = signUpDto;
    const found = await this.findOne({ email });
    if (found) throw new BadRequestException('Email is already registered');

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const user = await this.create({ name, email, password: hashed });
    await this.save(user);
    user.password = undefined;
    return user;
  }

  async authenticateUser(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const found = await this.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'password', 'avatar', 'createdAt'],
    });

    if (!found) throw new BadRequestException('Invalid email or password');
    if (!(await bcrypt.compare(password, found.password)))
      throw new BadRequestException('Invalid email or password');

    found.password = undefined;
    return found;
  }
}
