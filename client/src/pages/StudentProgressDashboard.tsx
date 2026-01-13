import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface CourseProgress {
  courseId: number;
  courseName: string;
  completedLessons: number;
  totalLessons: number;
  completionPercentage: number;
  averageScore: number;
}

interface PracticeTestScore {
  testName: string;
  score: number;
  date: string;
}

interface DiagnosticResult {
  subject: string;
  percentage: number;
  skillGaps: string[];
}

interface Certificate {
  id: number;
  courseName: string;
  certificateCode: string;
  issueDate: string;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function StudentProgressDashboard() {
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [practiceTestScores, setPracticeTestScores] = useState<PracticeTestScore[]>([]);
  const [diagnosticResults, setDiagnosticResults] = useState<DiagnosticResult[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch course progress
        const progressRes = await fetch('/api/student/progress');
        const progressData = await progressRes.json();
        setCourseProgress(progressData);

        // Calculate overall progress
        const totalCompletion = progressData.reduce((sum: number, course: CourseProgress) => sum + course.completionPercentage, 0) / progressData.length;
        setOverallProgress(Math.round(totalCompletion));

        // Fetch practice test scores
        const testsRes = await fetch('/api/student/practice-tests/results');
        const testsData = await testsRes.json();
        setPracticeTestScores(testsData);

        // Fetch diagnostic results
        const diagnosticRes = await fetch('/api/student/diagnostic/results');
        const diagnosticData = await diagnosticRes.json();
        setDiagnosticResults(diagnosticData);

        // Fetch certificates
        const certRes = await fetch('/api/student/certificates');
        const certData = await certRes.json();
        setCertificates(certData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Your Learning Progress</h1>
          <p className="text-slate-600">Track your GED preparation journey</p>
        </div>

        {/* Overall Progress */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Overall Progress</h2>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="w-full bg-slate-200 rounded-full h-4 mb-2">
                <div
                  className="bg-gradient-to-r from-blue-600 to-blue-400 h-4 rounded-full transition-all"
                  style={{ width: `${overallProgress}%` }}
                ></div>
              </div>
              <p className="text-slate-600">
                {overallProgress}% Complete - You're making great progress!
              </p>
            </div>
            <div className="ml-8 text-center">
              <div className="text-5xl font-bold text-blue-600">{overallProgress}%</div>
              <p className="text-slate-600">Overall</p>
            </div>
          </div>
        </div>

        {/* Course Progress Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {courseProgress.map(course => (
            <div key={course.courseId} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">{course.courseName}</h3>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-slate-600 mb-2">
                  <span>Lessons Completed</span>
                  <span>{course.completedLessons}/{course.totalLessons}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${course.completionPercentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Average Score</span>
                <span className="text-lg font-semibold text-blue-600">{course.averageScore}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Practice Test Performance */}
        {practiceTestScores.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Practice Test Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={practiceTestScores}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="testName" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} name="Score %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Diagnostic Results */}
        {diagnosticResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Diagnostic Assessment Results</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={diagnosticResults}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="percentage" fill="#3b82f6" name="Score %" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {diagnosticResults.map((result, index) => (
                <div key={index} className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-slate-900 mb-2">{result.subject}</h4>
                  <p className="text-sm text-slate-600 mb-2">Score: <span className="font-semibold">{result.percentage}%</span></p>
                  {result.skillGaps.length > 0 && (
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Areas to improve:</p>
                      <ul className="text-sm text-slate-600">
                        {result.skillGaps.map((gap, i) => (
                          <li key={i}>• {gap}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certificates */}
        {certificates.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Your Certificates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certificates.map(cert => (
                <div key={cert.id} className="border-2 border-blue-600 rounded-lg p-6 bg-gradient-to-br from-blue-50 to-slate-50">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🎓</div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">{cert.courseName}</h3>
                    <p className="text-sm text-slate-600 mb-4">Certificate Code: {cert.certificateCode}</p>
                    <p className="text-xs text-slate-500">Issued: {new Date(cert.issueDate).toLocaleDateString()}</p>
                    <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                      Download Certificate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {certificates.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-slate-600 mb-4">Complete courses to earn certificates!</p>
            <p className="text-sm text-slate-500">Keep working through the lessons and practice tests to complete your courses.</p>
          </div>
        )}
      </div>
    </div>
  );
}
