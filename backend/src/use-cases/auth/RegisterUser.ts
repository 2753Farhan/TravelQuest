import { UserRepository } from "../../domain/interfaces/UserRepository";
import { AuthService } from "../../domain/services/AuthService";
import { EmailService } from "../../domain/services/EmailService";
import { RegisterUserDto } from "../../interface/dto/AuthDto";
import { BadRequestError } from "../../interface/errors/BadRequestError";

export class RegisterUser {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
    private readonly emailService: EmailService
  ) {}

  async execute(dto: RegisterUserDto): Promise<{ message: string }> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestError('Email already in use');
    }

    const existingUsername = await this.userRepository.findByUsername(dto.username);
    if (existingUsername) {
      throw new BadRequestError('Username already taken');
    }

    const user = await this.authService.register(dto);

    
    const verificationToken = this.authService.generateVerificationToken(user.id);
    await this.emailService.sendVerificationEmail(user.email, verificationToken);

    return { message: 'User registered successfully. Please check your email to verify your account.' };
  }
}