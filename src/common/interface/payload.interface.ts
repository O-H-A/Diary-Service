import { UserGradeEnum } from '../enum/enum';

export interface PayloadInterface {
  userId: number;
  providerId: string;
  userGrade: UserGradeEnum;
  iat: number;
  exp: number;
}
