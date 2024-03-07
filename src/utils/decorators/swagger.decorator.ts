import { ApiOperation, ApiResponse, ApiTags, ApiBody, ApiParam, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';

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

export const ApiResponseErrorBadRequest = (des: string) => ApiResponse({ status: 400, description: des });

export const ApiResponseErrorUnauthorized = (des: string) => ApiResponse({ status: 401, description: des });

export const ApiResponseErrorNotFound = (des: string) => ApiResponse({ status: 404, description: des });

export const ApiResponseErrorConflict = (des: string) => ApiResponse({ status: 409, description: des });

export const ApiResponseErrorServer = (des: string) => ApiResponse({ status: 500, description: des });

// {
//   "statusCode": 200,
//   "message": "상세 조회 성공",
//   "data": {
//     "diaryId": 21,
//     "title": "in 베트남",
//     "weather": "WTHR_PARTLY_CLOUDY",
//     "content": null,
//     "setDate": "201910020",
//     "location": "다낭",
//     "isPublic": false,
//     "likes": "0",
//     "views": "0",
//     "createdAt": "2024-03-07T10:34:08.054Z",
//     "updatedAt": "2024-03-07T10:34:08.054Z",
//     "fileRelation": [
//       {
//         "fileId": 10,
//         "fileUrl": "http://undefined/files/diary/1709807648072.png",
//         "createdAt": "2024-03-07T10:34:08.054Z",
//         "updatedAt": "2024-03-07T10:34:08.054Z"
//       }
//     ],
//     "writer": {
//       "userId": 16,
//       "providerType": "GOOGLE",
//       "email": "snghyun331@gmail.com",
//       "name": "もんぺ.2",
//       "profileUrl": "http://52.79.158.1/files/user/1709226981701.jpg",
//       "isWithdraw": false,
//       "createdAt": "2024-02-07T06:06:40.729Z",
//       "updatedAt": "2024-03-07T10:25:50.960Z"
//     }
//   }
// }
