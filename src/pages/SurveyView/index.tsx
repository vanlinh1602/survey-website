'use client';

import { AlertCircle } from 'lucide-react';
import { useState } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

// Sample survey data (in a real app, this would come from an API or database)
const surveyData = {
  id: '1',
  title: 'Customer Satisfaction Survey',
  description: 'Help us improve our services by providing your feedback.',
  questions: [
    {
      id: 'q1',
      type: 'text',
      text: 'What is your name?',
      required: true,
    },
    {
      id: 'q2',
      type: 'multipleChoice',
      text: 'How satisfied are you with our product?',
      options: [
        'Very Satisfied',
        'Satisfied',
        'Neutral',
        'Dissatisfied',
        'Very Dissatisfied',
      ],
      required: true,
    },
    {
      id: 'q3',
      type: 'checkbox',
      text: 'Which features do you use most? (Select all that apply)',
      options: ['Feature A', 'Feature B', 'Feature C', 'Feature D'],
      required: false,
    },
    {
      id: 'q4',
      type: 'textarea',
      text: 'Do you have any additional comments or suggestions?',
      required: false,
    },
  ],
};

export default function ListSurvey() {
  const [responses, setResponses] = useState<Record<string, string | string[]>>(
    {}
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleTextChange = (questionId: string, value: string) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
    setErrors((prev) => ({ ...prev, [questionId]: '' }));
  };

  const handleMultipleChoiceChange = (questionId: string, value: string) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
    setErrors((prev) => ({ ...prev, [questionId]: '' }));
  };

  const handleCheckboxChange = (
    questionId: string,
    value: string,
    checked: boolean
  ) => {
    setResponses((prev) => {
      const currentValues = (prev[questionId] as string[]) || [];
      if (checked) {
        return { ...prev, [questionId]: [...currentValues, value] };
      } else {
        return {
          ...prev,
          [questionId]: currentValues.filter((v) => v !== value),
        };
      }
    });
    setErrors((prev) => ({ ...prev, [questionId]: '' }));
  };

  const validateResponses = () => {
    const newErrors: Record<string, string> = {};
    surveyData.questions.forEach((question) => {
      if (question.required) {
        const response = responses[question.id];
        if (!response || (Array.isArray(response) && response.length === 0)) {
          newErrors[question.id] = 'This question is required';
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateResponses()) {
      console.log('Survey responses:', responses);
      // Here you would typically send the responses to your backend
      alert('Thank you for completing the survey!');
    } else {
      alert('Please answer all required questions before submitting.');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">{surveyData.title}</h1>
      <p className="text-muted-foreground mb-6">{surveyData.description}</p>

      <ScrollArea className="h-[60vh] pr-4 -mr-4">
        {surveyData.questions.map((question) => (
          <Card key={question.id} className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                {question.text}
                {question.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </CardTitle>
              {errors[question.id] && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{errors[question.id]}</AlertDescription>
                </Alert>
              )}
            </CardHeader>
            <CardContent>
              {question.type === 'text' && (
                <Input
                  value={(responses[question.id] as string) || ''}
                  onChange={(e) =>
                    handleTextChange(question.id, e.target.value)
                  }
                  placeholder="Enter your answer"
                />
              )}
              {question.type === 'multipleChoice' && (
                <RadioGroup
                  value={responses[question.id] as string}
                  onValueChange={(value) =>
                    handleMultipleChoiceChange(question.id, value)
                  }
                >
                  {question.options?.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={option}
                        id={`${question.id}-${option}`}
                      />
                      <Label htmlFor={`${question.id}-${option}`}>
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
              {question.type === 'checkbox' && (
                <div className="space-y-2">
                  {question.options?.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${question.id}-${option}`}
                        checked={(
                          (responses[question.id] as string[]) || []
                        ).includes(option)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(
                            question.id,
                            option,
                            checked as boolean
                          )
                        }
                      />
                      <Label htmlFor={`${question.id}-${option}`}>
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
              {question.type === 'textarea' && (
                <Textarea
                  value={(responses[question.id] as string) || ''}
                  onChange={(e) =>
                    handleTextChange(question.id, e.target.value)
                  }
                  placeholder="Enter your answer"
                  rows={4}
                />
              )}
            </CardContent>
          </Card>
        ))}
      </ScrollArea>

      <div className="mt-6">
        <Button onClick={handleSubmit} className="w-full">
          Submit Survey
        </Button>
      </div>
    </div>
  );
}
