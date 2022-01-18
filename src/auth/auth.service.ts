import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  constructor(
    private userRepo: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const user = await this.userRepo.createUser(signUpDto);
    return { token: this.jwtService.sign({ id: user.id }), user };
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.userRepo.authenticateUser(signInDto);
    return { token: this.jwtService.sign({ id: user.id }), user };
  }
}
