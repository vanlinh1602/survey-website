import { PlusCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

type Question = {
  id: number;
  type: string;
  text: string;
  options?: string[];
};

export default function CreateSurvey() {
  const navigate = useNavigate();
  const { id: surveyId } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);

  const addQuestion = () => {
    setQuestions([...questions, { id: Date.now(), type: 'text', text: '' }]);
  };

  const updateQuestion = (id: number, field: string, value: string) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const addOption = (questionId: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, options: [...(q.options || []), ''] } : q
      )
    );
  };

  const updateOption = (questionId: number, index: number, value: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options?.map((opt, i) => (i === index ? value : opt)),
            }
          : q
      )
    );
  };

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold mb-6">Create New Survey</h1>
        <Button onClick={() => navigate(`/${surveyId}`)}>Save & Preview</Button>
      </div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Survey Details</CardTitle>
          <CardDescription>
            Enter the basic information about your survey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Survey Title</Label>
            <Input
              id="title"
              placeholder="Enter survey title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter survey description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Questions</CardTitle>
          <CardDescription>
            Add and configure your survey questions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {questions.map((question) => (
            <Card key={question.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Question {questions.indexOf(question) + 1}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeQuestion(question.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                <Select
                  value={question.type}
                  onValueChange={(value) =>
                    updateQuestion(question.id, 'type', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select question type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="multipleChoice">
                      Multiple Choice
                    </SelectItem>
                    <SelectItem value="checkbox">Checkbox</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Enter question text"
                  value={question.text}
                  onChange={(e) =>
                    updateQuestion(question.id, 'text', e.target.value)
                  }
                />
                {(question.type === 'multipleChoice' ||
                  question.type === 'checkbox') && (
                  <div className="space-y-2">
                    {question.options?.map((option, index) => (
                      <Input
                        key={index}
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) =>
                          updateOption(question.id, index, e.target.value)
                        }
                      />
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addOption(question.id)}
                    >
                      Add Option
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          <Button onClick={addQuestion}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Question
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Survey Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch id="anonymous" />
            <Label htmlFor="anonymous">Allow anonymous responses</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="multiple-responses" />
            <Label htmlFor="multiple-responses">
              Allow multiple responses per user
            </Label>
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}
