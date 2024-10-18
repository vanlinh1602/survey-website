import _ from 'lodash';
import { AlertCircle } from 'lucide-react';
import { useMemo } from 'react';

import { SearchableSelect } from '@/components';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import citiesJson from '@/data/cities.json';
import { City, Question } from '@/features/surveys/type';

type Props = {
  question: Question;
  questionId: string;
  onChange: (path: string[], value: string[]) => void;
  error: string;
  value: string[];
};

export const UnitQuestion = ({
  question,
  onChange,
  questionId,
  error,
  value,
}: Props) => {
  const cities: CustomObject<City> = useMemo(() => citiesJson, []);
  const [province, district, ward] = value || [];

  const districtsOptions = useMemo(() => {
    if (!province) {
      return [];
    }
    return Object.entries(cities[province].districts || {}).map(
      ([key, { name }]) => ({
        value: key,
        label: name,
      })
    );
  }, [cities, province]);

  const wardsOptions = useMemo(() => {
    if (!district) {
      return [];
    }
    return Object.entries(
      _.get(cities, [province!, 'districts', district, 'wards'], {})
    ).map(([key, { name }]) => ({
      value: key,
      label: name,
    }));
  }, [cities, district, province]);

  return (
    <Card key={questionId} className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center text-base">
          {question.text}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </CardTitle>
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Thiếu thông tin</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardHeader>
      <CardContent className="flex space-x-3">
        <div>
          <div className="block text-sm font-medium text-gray-700 mb-2">
            Tỉnh/Thành
          </div>
          <SearchableSelect
            options={Object.entries(cities).map(([provinceKey, { name }]) => ({
              value: provinceKey,
              label: name,
            }))}
            onSelect={(v) => {
              onChange([questionId], [v]);
            }}
            placeholder="Chọn thành phố"
            value={province}
          />
        </div>
        <div>
          <div className="block text-sm font-medium text-gray-700 mb-2">
            Quận/Huyện
          </div>
          <SearchableSelect
            options={districtsOptions}
            onSelect={(v) => {
              onChange([questionId], [province, v]);
            }}
            placeholder="Chọn quận huyện"
            value={district}
          />
        </div>
        <div>
          <div className="block text-sm font-medium text-gray-700 mb-2">
            Phường/Xã
          </div>
          <SearchableSelect
            options={wardsOptions}
            onSelect={(v) => {
              onChange([questionId], [province, district, v]);
            }}
            placeholder="Chọn phường xã"
            value={ward}
          />
        </div>
      </CardContent>
    </Card>
  );
};
