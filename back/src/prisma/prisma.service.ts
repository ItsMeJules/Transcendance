import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor(config: ConfigService) {
        super({
            datasources: {
                db: {
                    url: config.get('DATABASE_URL')
                },
            },
        });
    }

    async onModuleInit() {
        await this.$connect();
    }

    async onApplicationShutdown(signal?: string) {
        await this.$disconnect();
    }

    // cleanDb() {
    //     return this.$transaction([
    //         // this.bookmark.deleteMany(),
    //         this.user.deleteMany(),
    //     ]);
    // }
}
