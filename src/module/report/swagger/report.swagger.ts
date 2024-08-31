import { ActionInfoDto } from '../dto/actionInfo.dto';

export const DIARY_REPORT: any = {
  POST: {
    API_OPERATION: {
      summary: '다이어리 신고 등록 API',
    },
    API_RESPONSE_OK: {
      status: 201,
      content: {
        'application/json': {
          example: {
            statusCode: 201,
            message: '신고 등록 성공',
          },
        },
      },
    },
    API_RESPONSE_ERR_400: {
      status: 400,
      description: 'Validation 에러 혹은 데이터 없음',
    },
    API_RESPONSE_ERR_404: {
      status: 404,
      description: '다이어리 존재X',
    },
  },
};

export const DIARY_ADMIN_REPORT_ACTION: any = {
  PATCH: {
    API_OPERATION: {
      summary: '다이어리 신고조치 업데이트 API',
    },
    API_BODY: {
      type: ActionInfoDto,
      examples: {
        a: {
          summary: '신고조치 1개 선택',
          value: {
            reportId: 2,
            actionCodes: ['REP_ACT_002'],
          },
        },
        b: {
          summary: '신고조치 2개 이상 선택',
          value: {
            reportId: 2,
            actionCodes: ['REP_ACT_001', 'REP_ACT_003'],
          },
        },
      },
      required: true,
    },
    API_RESPONSE_OK: {
      status: 200,
      content: {
        'application/json': {
          example: {
            statusCode: 200,
            message: '신고 조치 업데이트 성공',
          },
        },
      },
    },
    API_RESPONSE_ERR_400: {
      status: 400,
      description: 'Validation 에러 혹은 데이터 없음',
    },
    API_RESPONSE_ERR_404: {
      status: 404,
      description: '신고이력X, 다이어리 존재X',
    },
  },
};

export const DIARY_ADMIN_REPORTLIST: any = {
  GET: {
    API_OPERATION: {
      summary: '다이어리 신고 정보 조회 API',
    },
    API_QUERY_1: { name: 'reasonCode', description: '신고 사유 코드를 입력해주세요', required: false },
    API_QUERY_2: { name: 'isDone', description: '신고 조치 여부를 입력해주세요', required: false },
    API_RESPONSE_OK: {
      status: 200,
      content: {
        'application/json': {
          example: {
            statusCode: 200,
            message: '모든 다이어리 신고 목록 조회 성공',
            data: [
              {
                reportId: 2,
                diaryId: 1,
                reasonCode: 'REP_RSN_001',
                reportingUserId: '31',
                isDone: true,
                actionCodes: ['REP_ACT_001', 'REP_ACT_003'],
                regDtm: '2024-06-23T05:26:26.886Z',
                actionDtm: '2024-06-24T13:47:14.748Z',
                reportingUserName: '승현14',
                reportingUserProfile: null,
                reportedUserId: 30,
                reportedUserName: null,
                reportedUserProfileUrl: null,
              },
            ],
          },
        },
      },
    },
  },
};
