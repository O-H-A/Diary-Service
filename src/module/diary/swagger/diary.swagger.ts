import { SwaggerMethod } from 'src/common/interface/swagger.interface';
import { DiariesInfoDto } from '../dto/diaries-info.dto';
import { CreateDiaryDto } from '../dto/create-diary.dto';

export const DIARY: SwaggerMethod = {
  POST: {
    API_OPERATION: {
      summary: '다이어리 등록 API',
    },
    API_BODY: {
      type: CreateDiaryDto,
    },
    API_CREATED_RESPONSE: {
      content: {
        'application/json': {
          example: {
            statusCode: 201,
            message: '등록 성공',
          },
        },
      },
    },
  },
  PUT: {
    API_OPERATION: {
      summary: '다이어리 수정 API',
    },
    API_PARAM1: {
      name: 'diaryId',
      description: '숫자로 입력해주세요',
      type: Number,
      required: true,
    },
    API_OK_RESPONSE: {
      content: {
        'application/json': {
          example: {
            statusCode: 200,
            message: '수정 성공',
          },
        },
      },
    },
    API_BAD_REQUEST_RESPONSE: {
      description: '수정된 다이어리가 없음',
    },
    API_FORBIDDEN_RESPONSE: {
      description: '다이어리 수정 권한이 없음',
    },
  },
  DELETE: {
    API_OPERATION: {
      summary: '다이어리 삭제 API',
    },
    API_PARAM1: {
      name: 'diaryId',
      type: Number,
      description: '숫자로 입력해주세요',
    },
    API_OK_RESPONSE: {
      content: {
        'application/json': {
          example: {
            statusCode: 200,
            message: '삭제 성공',
          },
        },
      },
    },
    API_BAD_REQUEST_RESPONSE: {
      description: '삭제된 다이어리 없음',
    },
    API_FORBIDDEN_RESPONSE: {
      description: '다이어리 삭제 권한이 없음',
    },
    API_NOT_FOUND_RESPONSE: {
      description: '다이어리가 이미 삭제되었거나 존재하지 않음',
    },
  },
  GET: {
    API_OPERATION: {
      summary: '다이어리 상세 조회 API',
    },
    API_PARAM1: {
      name: 'diaryId',
      type: Number,
      description: '숫자로 입력해주세요',
    },
    API_OK_RESPONSE: {
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
    },
    API_NOT_FOUND_RESPONSE: {
      description: '존재하지 않는 다이어리',
    },
  },
};

export const SPECIFIC_DIARIES: SwaggerMethod = {
  POST: {
    API_OPERATION: {
      summary: '특정 여러 다이어리 조회 API - Backend용',
    },
    API_BODY: {
      type: DiariesInfoDto,
      examples: {
        a: {
          value: {
            diaryIds: [44, 45],
          },
        },
      },
    },
    API_CREATED_RESPONSE: {
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
    },
  },
};

export const DIARY_MY: SwaggerMethod = {
  GET: {
    API_OPERATION: {
      summary: '사용지기 작성한 다이어리 조회 API(전체기간)',
      description: '가장 최근에 등록된 순으로 정렬됩니다.',
    },
    API_OK_RESPONSE: {
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
    },
  },
};

export const DIARIES_OTHER_USERS: SwaggerMethod = {
  GET: {
    API_OPERATION: {
      summary: '다른 사용자가 작성한 다이어리 조회 API(전체기간)',
      description: '가장 최근에 등록된 순으로 정렬됩니다',
    },
    API_PARAM1: {
      name: 'userId',
      type: Number,
      required: true,
      description: '숫자로 입력해주세요',
    },
    API_OK_RESPONSE: {
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
    },
  },
};

export const DIARY_LIKES: SwaggerMethod = {
  POST: {
    API_OPERATION: {
      summary: '다이어리 좋아요 생성 API',
      description: '좋아요 클릭 시 사용되는 API',
    },
    API_PARAM1: {
      name: 'diaryId',
      description: '숫자로 입력해주세요',
      type: Number,
      required: true,
    },
    API_CREATED_RESPONSE: {
      content: {
        'application/json': {
          example: {
            statusCode: 201,
            message: '좋아요 생성 성공',
          },
        },
      },
    },
    API_BAD_REQUEST_RESPONSE: {
      description: 'diaryId 혹은 userId가 요청되지 않았을 경우',
    },
    API_NOT_FOUND_RESPONSE: {
      description: '다이어리가 이미 삭제되었거나 존재하지 않을 경우',
    },
    API_CONFLICT_RESPONSE: {
      description: '좋아요를 이미 눌렀을 경우',
    },
  },
  DELETE: {
    API_OPERATION: {
      summary: '다이어리 좋아요 취소 API',
      description: '좋아요 취소 시 사용되는 api',
    },
    API_PARAM1: {
      name: 'diaryId',
      description: '숫자로 입력해주세요',
      type: Number,
      required: true,
    },
    API_OK_RESPONSE: {
      content: {
        'application/json': {
          example: {
            statusCode: 200,
            message: '좋아요 취소 성공',
          },
        },
      },
    },
    API_BAD_REQUEST_RESPONSE: {
      description: 'diaryId 혹은 userId가 요청되지 않았을 경우',
    },
    API_CONFLICT_RESPONSE: {
      description: '좋아요가 이미 취소되었거나 다이어리가 존재하지 않을 경우',
    },
  },
  GET: {
    API_OPERATION: {
      summary: '다이어리 좋아요 정보 조회 API',
      description:
        '다이어리 상세 조회 시 사용자가 해당 다이어리에 이미 좋아요를 눌렀는지 확인하는 용도입니다. 해당 다이어리에 좋아요를 누른 모든 사용자 아이디가 응답값으로 반환됩니다. 좋아요가 아직 없는 다이어리일 경우 빈 배열이 응답값으로 반환됩니다',
    },
    API_PARAM1: {
      name: 'diaryId',
      description: '숫자로 입력해주세요',
      type: Number,
      required: true,
    },
    API_OK_RESPONSE: {
      content: {
        'application/json': {
          example: {
            statusCode: 200,
            message: '좋아요 취소 성공',
          },
        },
      },
    },
  },
};
