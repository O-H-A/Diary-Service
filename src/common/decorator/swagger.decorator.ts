import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiParam,
  ApiConsumes,
  ApiBearerAuth,
  ApiCreatedResponse,
} from '@nestjs/swagger';

export const ApiTagDiary = () => ApiTags('DIARY');

export const ApiDescription = (summary: string, description?: string) => ApiOperation({ summary, description });

export const ApiBearerAuthAccessToken = () => ApiBearerAuth('access-token');

export const ApiConsumesMultiForm = () => ApiConsumes('multipart/form-data');

export const ApiBodyImageForm = (fieldname: string) =>
  ApiBody({
    schema: {
      type: 'object',
      properties: {
        [fieldname]: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  });

export const ApiParamDescription = (name: string, des: string) => ApiParam({ name: name, description: des });

export const ApiResponseSuccess = () => ApiResponse({ status: 200, description: 'OK' });

export const ApiResponseErrorForbidden = (des) => ApiResponse({ status: 403, description: des });

export const ApiResponseErrorBadRequest = (des: string) => ApiResponse({ status: 400, description: des });

export const ApiResponseErrorUnauthorized = (des: string) => ApiResponse({ status: 401, description: des });

export const ApiResponseErrorNotFound = (des: string) => ApiResponse({ status: 404, description: des });

export const ApiResponseErrorConflict = (des: string) => ApiResponse({ status: 409, description: des });

export const ApiResponseErrorServer = (des: string) => ApiResponse({ status: 500, description: des });

export const ApiResponseCreateDiary = () =>
  ApiCreatedResponse({
    content: {
      'application/json': {
        example: {
          statusCode: 201,
          message: '등록 성공',
        },
      },
    },
  });

export const ApiResponseUpdateDiary = () =>
  ApiResponse({
    status: 200,
    content: {
      'application/json': {
        example: {
          statusCode: 200,
          message: '수정 성공',
        },
      },
    },
  });

export const ApiResponseDeleteDiary = () =>
  ApiResponse({
    status: 200,
    content: {
      'application/json': {
        example: {
          statusCode: 200,
          message: '삭제 성공',
        },
      },
    },
  });

export const ApiResponseDiaryDetail = () =>
  ApiResponse({
    status: 200,
    content: {
      'application/json': {
        example: {
          statusCode: 200,
          message: '상세 조회 성공',
          data: {
            diaryId: 34,
            title: 'in 베트남',
            weather: 'WTHR_PARTLY_CLOUDY',
            content: null,
            setDate: '20240313',
            location: '하노이',
            isPublic: false,
            likes: '0',
            views: '4',
            createdAt: '2024-03-13T12:42:02.005Z',
            updatedAt: '2024-03-15T12:36:40.047Z',
            fileRelation: [
              {
                fileId: 23,
                fileUrl: 'http://undefined/files/diary/1710333722042.png',
                createdAt: '2024-03-13T12:42:02.005Z',
                updatedAt: '2024-03-13T12:42:02.005Z',
              },
            ],
            writer: {
              userId: 16,
              providerType: 'GOOGLE',
              email: 'snghyun331@gmail.com',
              name: 'もんぺ.2',
              profileUrl: 'http://52.79.158.1/files/user/1709226981701.jpg',
              isWithdraw: false,
              createdAt: '2024-02-07T06:06:40.729Z',
              updatedAt: '2024-03-15T14:03:37.458Z',
            },
          },
        },
      },
    },
  });

export const ApiResponseDiary = () =>
  ApiResponse({
    status: 200,
    content: {
      'application/json': {
        example: {
          statusCode: 200,
          message: '전체 기간 조회 성공',
          data: {
            writer: {
              userId: 30,
              providerType: 'GOOGLE',
              email: 'snghyun331@gmail.com',
              name: null,
              profileUrl: null,
              createdAt: '2024-05-06T04:29:20.825Z',
              updatedAt: '2024-05-06T05:10:00.311Z',
            },
            diaries: [
              {
                diaryId: 46,
                userId: '30',
                title: '다낭이 흐려',
                weather: 'WTHR_PARTLY_CLOUDY',
                content: '예~~',
                setDate: '20240410',
                location: 'skyland',
                isPublic: true,
                likes: '0',
                views: '0',
                createdAt: '2024-05-06T05:35:53.463Z',
                updatedAt: '2024-05-06T05:35:53.463Z',
                fileRelation: [
                  {
                    fileId: 40,
                    fileUrl: 'https://ohauser2.serveftp.com/files/diary/1714973753466.jpg',
                    createdAt: '2024-05-06T05:35:53.463Z',
                    updatedAt: '2024-05-06T05:35:53.463Z',
                  },
                ],
              },
              {
                diaryId: 44,
                userId: '30',
                title: '다낭에 눈이 왔어요 ><',
                weather: 'WTHR_SNOW',
                content: '예~~',
                setDate: '20240315',
                location: 'skyland',
                isPublic: true,
                likes: '0',
                views: '0',
                createdAt: '2024-05-06T05:33:53.228Z',
                updatedAt: '2024-05-06T05:33:53.228Z',
                fileRelation: [
                  {
                    fileId: 38,
                    fileUrl: 'https://ohauser2.serveftp.com/files/diary/1714973633247.png',
                    createdAt: '2024-05-06T05:33:53.228Z',
                    updatedAt: '2024-05-06T05:33:53.228Z',
                  },
                ],
              },
              {
                diaryId: 45,
                userId: '30',
                title: '다낭이 흐려',
                weather: 'WTHR_PARTLY_CLOUDY',
                content: '예~~',
                setDate: '20240210',
                location: 'skyland',
                isPublic: true,
                likes: '0',
                views: '0',
                createdAt: '2024-05-06T05:35:33.768Z',
                updatedAt: '2024-05-06T05:35:33.768Z',
                fileRelation: [
                  {
                    fileId: 39,
                    fileUrl: 'https://ohauser2.serveftp.com/files/diary/1714973733772.jpg',
                    createdAt: '2024-05-06T05:35:33.768Z',
                    updatedAt: '2024-05-06T05:35:33.768Z',
                  },
                ],
              },
            ],
          },
        },
      },
    },
  });

export const ApiResponseCreateDiaryLike = () =>
  ApiCreatedResponse({
    content: {
      'application/json': {
        example: {
          statusCode: 201,
          message: '좋아요 생성 성공',
        },
      },
    },
  });

export const ApiReponseDeleteDiaryLike = () =>
  ApiResponse({
    status: 200,
    content: {
      'application/json': {
        example: {
          statusCode: 200,
          message: '좋아요 취소 성공',
        },
      },
    },
  });

export const ApiResponseGetDiaryLike = () =>
  ApiResponse({
    description:
      'currentUserId: 현재 접속하고 있는 사용자의 아이디, userId: 해당 다이어리에 좋아요를 누른 사용자 아이디',
    status: 200,
    content: {
      'application/json': {
        example: {
          statusCode: 200,
          message: '좋아요 정보 조회 성공',
          data: {
            DiaryLikesInfo: [
              {
                likesId: 15,
                diaryId: '34',
                userId: '16',
              },
              {
                likesId: 16,
                diaryId: '34',
                userId: '17',
              },
            ],
            currentUserId: '16',
          },
        },
      },
    },
  });

export const ApiResponseSpecificDiaries = () =>
  ApiResponse({
    status: 200,
    content: {
      'application/json': {
        example: {
          statusCode: 200,
          message: '특정 여러 다이어리 조회 성공',
          data: [
            {
              diaryId: 44,
              userId: '30',
              title: '다낭에 눈이 왔어요 ><',
              weather: 'WTHR_SNOW',
              content: '예~~',
              setDate: '20240315',
              location: 'skyland',
              isPublic: true,
              likes: '0',
              views: '0',
              createdAt: '2024-05-06T05:33:53.228Z',
              updatedAt: '2024-05-06T05:33:53.228Z',
            },
            {
              diaryId: 45,
              userId: '30',
              title: '다낭이 흐려',
              weather: 'WTHR_PARTLY_CLOUDY',
              content: '예~~',
              setDate: '20240210',
              location: 'skyland',
              isPublic: true,
              likes: '0',
              views: '2',
              createdAt: '2024-05-06T05:35:33.768Z',
              updatedAt: '2024-05-06T05:35:33.768Z',
            },
          ],
        },
      },
    },
  });
