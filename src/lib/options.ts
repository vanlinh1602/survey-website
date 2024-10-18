import kienGiangLogo from '@/assets/sgd_kien_giang.jpg';

export const unitAvailable: CustomObject<string> = {
  xbot: 'Xbot (Admin)',
  '91': 'Kiên Giang',
};

export const unitConfig: CustomObject<{
  titleSurvey?: string;
  logo?: string;
}> = {
  '91': {
    titleSurvey:
      '<p style="text-align: center;">UBND TỈNH KIÊN GIANG</p><p style="text-align: center;"><strong>SỞ GIÁO DỤC VÀ ĐÀO TẠO</strong></p>',
    logo: kienGiangLogo,
  },
};
