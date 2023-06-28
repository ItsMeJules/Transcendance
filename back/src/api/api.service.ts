import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiService {

	displayBigInt(bigInt : string): string {
		return bigInt;
	}
}

