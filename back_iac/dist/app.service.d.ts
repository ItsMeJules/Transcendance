import { AuthDto } from './auth/dto';
export declare class AppService {
    getHello(): string;
    test(dto: AuthDto): Promise<void>;
}
