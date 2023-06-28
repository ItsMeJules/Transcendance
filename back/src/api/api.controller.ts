import { Controller, Get , Query} from '@nestjs/common';

import { ApiService } from './api.service';
import { AuthReqQuery } from './dto/auth.req.query';


@Controller('api')
export class ApiController {

	constructor(private readonly apiService: ApiService) {}

	@Get('42')
	request42Api() {
		fetch('https://api.intra.42.fr/oauth/authorize')
		.then(response => console.log(response))
	}

	@Get('callback')
	getAuthCode(@Query() authReqQuery: AuthReqQuery): string {
		return this.apiService.displayBigInt(authReqQuery.code);
	}

}
