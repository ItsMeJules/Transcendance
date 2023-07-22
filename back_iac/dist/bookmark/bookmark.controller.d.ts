import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
export declare class BookmarkController {
    private bookmarkService;
    constructor(bookmarkService: BookmarkService);
    getBookmarks(userId: number): import(".prisma/client").Prisma.PrismaPromise<(import("@prisma/client/runtime/library").GetResult<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        link: string;
        userId: number;
    }, unknown> & {})[]>;
    getBookmarkById(userId: number, bookmarkId: number): import(".prisma/client").Prisma.Prisma__BookmarkClient<import("@prisma/client/runtime/library").GetResult<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        link: string;
        userId: number;
    }, unknown> & {}, null, import("@prisma/client/runtime/library").DefaultArgs>;
    createBookmarks(userId: number, dto: CreateBookmarkDto): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        link: string;
        userId: number;
    }, unknown> & {}>;
    editBookmarkById(userId: number, bookmarkId: number, dto: EditBookmarkDto): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        link: string;
        userId: number;
    }, unknown> & {}>;
    deleteBookmarkById(userId: number, bookmarkId: number): Promise<void>;
}
