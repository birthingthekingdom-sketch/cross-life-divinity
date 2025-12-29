import { useEffect, useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface PendingAnswer {
  id: number;
  userId: number;
  lessonId: number;
  courseId: number;
  questionId: number;
  questionText: string;
  studentAnswer: string;
  status: 'pending' | 'graded' | 'skipped';
  adminScore: number | null;
  adminFeedback: string | null;
  submittedAt: Date;
  gradedAt: Date | null;
}

export default function AdminGradingDashboard() {
  const [pendingAnswers, setPendingAnswers] = useState<PendingAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<PendingAnswer | null>(null);
  const [filterCourse, setFilterCourse] = useState<string>('all');
  const [filterStudent, setFilterStudent] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { data: answers, isLoading } = trpc.grading.getPendingWrittenAnswers.useQuery();
  const { data: pendingCount } = trpc.grading.getPendingWrittenAnswersCount.useQuery();
  const { data: courses } = trpc.courses.list.useQuery();

  useEffect(() => {
    if (answers) {
      setPendingAnswers(answers);
    }
  }, [answers]);

  const filteredAnswers = pendingAnswers.filter(answer => {
    if (filterCourse !== 'all' && answer.courseId !== parseInt(filterCourse)) {
      return false;
    }
    if (filterStudent && answer.userId !== parseInt(filterStudent)) {
      return false;
    }
    if (searchQuery && !answer.studentAnswer.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-slate-900">Written Answer Grading</h1>
            <div className="flex items-center gap-3">
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
                <p className="text-sm text-slate-600">Pending Review</p>
                <p className="text-2xl font-bold text-amber-600">{pendingCount || 0}</p>
              </div>
            </div>
          </div>
          <p className="text-slate-600">Review and grade student written answers from quizzes</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Filter by Course</label>
              <Select value={filterCourse} onValueChange={setFilterCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="All courses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All courses</SelectItem>
                  {courses?.map((course: any) => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.code} - {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Search Answers</label>
              <Input
                placeholder="Search student answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => {
                  setFilterCourse('all');
                  setFilterStudent('');
                  setSearchQuery('');
                }}
                variant="outline"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Answers List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              {isLoading ? (
                <div className="p-8 text-center text-slate-500">Loading answers...</div>
              ) : filteredAnswers.length === 0 ? (
                <div className="p-8 text-center">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="text-slate-600">All written answers have been graded!</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {filteredAnswers.map(answer => (
                    <div
                      key={answer.id}
                      onClick={() => setSelectedAnswer(answer)}
                      className={`p-4 cursor-pointer transition-colors ${
                        selectedAnswer?.id === answer.id
                          ? 'bg-blue-50 border-l-4 border-blue-500'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 line-clamp-2">
                            {answer.questionText}
                          </p>
                          <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                            {answer.studentAnswer}
                          </p>
                        </div>
                        <Badge
                          variant={answer.status === 'pending' ? 'default' : 'secondary'}
                          className="ml-2"
                        >
                          {answer.status === 'pending' ? (
                            <Clock className="w-3 h-3 mr-1" />
                          ) : (
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                          )}
                          {answer.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500">
                        Submitted: {typeof answer.submittedAt === 'string' ? new Date(answer.submittedAt).toLocaleString() : answer.submittedAt.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Grading Panel */}
          <div>
            {selectedAnswer ? (
              <GradingPanel answer={selectedAnswer} onGraded={() => setSelectedAnswer(null)} />
            ) : (
              <Card className="p-6 bg-slate-50 border-slate-200">
                <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-center text-slate-600">
                  Select an answer to grade
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface GradingPanelProps {
  answer: PendingAnswer;
  onGraded: () => void;
}

function GradingPanel({ answer, onGraded }: GradingPanelProps) {
  const [score, setScore] = useState<number>(answer.adminScore || 75);
  const [feedback, setFeedback] = useState<string>(answer.adminFeedback || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const gradeAnswerMutation = trpc.grading.gradeWrittenAnswer.useMutation();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await gradeAnswerMutation.mutateAsync({
        answerId: answer.id,
        score,
        feedback,
      });
      onGraded();
    } catch (error) {
      console.error('Failed to grade answer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 bg-white border-slate-200 sticky top-6">
      <h3 className="font-semibold text-slate-900 mb-4">Grade Answer</h3>

      {/* Question */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">Question</label>
        <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded border border-slate-200">
          {answer.questionText}
        </p>
      </div>

      {/* Student Answer */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">Student Answer</label>
        <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded border border-slate-200 max-h-32 overflow-y-auto">
          {answer.studentAnswer}
        </div>
      </div>

      {/* Score */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Score: <span className="text-lg font-bold text-blue-600">{score}/100</span>
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={score}
          onChange={(e) => setScore(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-2">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>

      {/* Feedback */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">Feedback</label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Provide constructive feedback for the student..."
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={6}
        />
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Grade & Send Notification'}
      </Button>

      {answer.adminScore !== null && (
        <p className="text-xs text-slate-500 mt-3 text-center">
          Previously graded: {answer.adminScore}/100
        </p>
      )}
    </Card>
  );
}
