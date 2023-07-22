import { AppService } from './app.service';
import { AuthDto } from './auth/dto';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    test(dto: AuthDto): Promise<void>;
}
