import { Test } from '@nestjs/testing'
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";
import { HttpStatus, INestApplication, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum'
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import { emitWarning } from 'process';
import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto';
// import { pactum } from 'pactum';


describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);
    pactum.request.setBaseUrl('http://localhost:3333')
    prisma = app.get(PrismaService);
    await prisma.cleanDb();
  });

  afterAll(async () => { });

  describe('Auth', () => {

    const dto: AuthDto = {
      email: 'c@test.com',
      password: '123'
    };

    describe('Signup', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup',)
          .withBody({
            password: dto.password,
          })
          .expectStatus(HttpStatus.BAD_REQUEST)
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup',)
          .withBody({
            email: dto.email,
          })
          .expectStatus(HttpStatus.BAD_REQUEST)
      });
      it('should throw if no body is provided', () => {
        return pactum
          .spec()
          .post('/auth/signup',)
          .withBody({})
          .expectStatus(HttpStatus.BAD_REQUEST)
      });
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup',)
          .withBody(dto)
          .expectStatus(HttpStatus.CREATED)
        // .inspect()
      });
    });

    describe('Signin', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin',)
          .withBody({
            password: dto.password,
          })
          .expectStatus(HttpStatus.BAD_REQUEST)
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin',)
          .withBody({
            email: dto.email,
          })
          .expectStatus(HttpStatus.BAD_REQUEST)
      });
      it('should throw if no body is provided', () => {
        return pactum
          .spec()
          .post('/auth/signin',)
          .withBody({})
          .expectStatus(HttpStatus.BAD_REQUEST)
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin',)
          .withBody(dto)
          .expectStatus(HttpStatus.OK)
          .stores('userAt', 'accessToken');
      });
    });
  });

  describe('User', () => {

    describe('Get me', () => {
      it('should get me page', () => {
        return pactum
          .spec()
          .get('/users/me',)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(HttpStatus.OK);
      })
    });

    describe('Edit user', () => {
      it('should edit the user', () => {
        const dto: EditUserDto = {
          firstName: "Lol",
          email: "lol@lol.com"
        }

        return pactum
          .spec()
          .patch('/users',)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(HttpStatus.OK)
          .expectBodyContains(dto.email)
          .expectBodyContains(dto.firstName);
      })
    });
  });

  describe('Bookmarks', () => {

    describe('Get empty bookmarks', () => {
      it('should get empty bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmark',)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(HttpStatus.OK)
          .expectBody([])
        // .inspect();
      })
    });

    describe('Create bookmark', () => {
      it('should create a bookmark', () => {
        const dto: CreateBookmarkDto = {
          title: 'First bookmark',
          link: 'https://www.youtube.com/watch?v=GHTA143_b-s&ab_channel=freeCodeCamp.org',
        }
        return pactum
          .spec()
          .post('/bookmark',)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(HttpStatus.CREATED)
          .stores('bookmarkId', 'id')
        // .inspect();
      })
    });

    describe('Get bookmarks', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmark',)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(HttpStatus.OK)
          .expectJsonLength(1)
        // .inspect();
      })
    });

    describe('Get bookmark by id', () => {
      it('should get bookmark by id', () => {
        return pactum
          .spec()
          .get('/bookmark/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(HttpStatus.OK)
          .expectBodyContains('$S{bookmarkId}')
          // .inspect();
      })
    });

    describe('Edit bookmark by id', () => {
      const dto: EditBookmarkDto = {
        title: "New title",
        description: "New description",
        link: "New link"
      };

      it('should edit bookmark by id', () => {
        return pactum
          .spec()
          .patch('/bookmark/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(HttpStatus.OK)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description)
        // .inspect();
      })
    });

    describe('Delete bookmark', () => {
      it('should delete bookmark by id', () => {
        return pactum
          .spec()
          .delete('/bookmark/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(HttpStatus.NO_CONTENT)
          // .inspect();
      })

      it('should get empty bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmark')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(HttpStatus.OK)
          .expectJsonLength(0)
          // .inspect();
      })
    });

  });

});