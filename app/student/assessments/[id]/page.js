'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function TakeAssessment() {
  const router = useRouter();
  const params = useParams();
  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/assessments').then(r => r.json()),
      fetch(`/api/questions?assessment_id=${params.id}`).then(r => r.json()),
    ]).then(([a, q]) => {
      const assmt = a.assessments?.find(x => x.id === parseInt(params.id));
      if (assmt) {
        if (assmt.result_id) {
          setSubmitted(true);
          setResult({ score: assmt.score, total: assmt.total, percentage: Math.round((assmt.score/assmt.total)*100) });
        }
        setAssessment(assmt);
        setTimeLeft(assmt.duration_minutes * 60);
      }
      setQuestions(q.questions || []);
      setLoading(false);
    });
  }, [params.id]);

  const handleSubmit = useCallback(async () => {
    if (submitted) return;
    setSubmitted(true);
    if (timerRef.current) clearInterval(timerRef.current);
    try {
      const res = await fetch('/api/assessment-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessment_id: parseInt(params.id), answers }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setResult({ error: data.error });
      }
    } catch {
      setResult({ error: 'Submission failed' });
    }
  }, [params.id, answers, submitted]);

  // Timer
  useEffect(() => {
    if (submitted || loading || !assessment) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [submitted, loading, assessment, handleSubmit]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="page-loading"><div className="loading-spinner" style={{width:40,height:40}}></div><p>Loading assessment...</p></div>;
  if (!assessment) return <div className="page-loading"><h3>Assessment not found</h3></div>;

  const answeredCount = Object.keys(answers).length;
  const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>{assessment.title}</h1>
          <p>{questions.length} Questions • {assessment.type} test</p>
        </div>
        <button onClick={() => router.push('/student/assessments')} className="btn btn-secondary">← Back</button>
      </div>

      {!submitted ? (
        <div className="quiz-container">
          {/* Timer & Progress */}
          <div className="quiz-header">
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Progress</div>
              <div style={{ fontWeight: 600 }}>{answeredCount} / {questions.length} answered</div>
            </div>
            <div className={`quiz-timer ${timeLeft < 60 ? 'warning' : ''}`}>
              ⏱ {formatTime(timeLeft)}
            </div>
          </div>

          <div className="quiz-progress">
            <div className="quiz-progress-bar" style={{ width: `${progress}%` }}></div>
          </div>

          {/* Questions */}
          {questions.map((q, i) => (
            <div key={q.id} className="question-card">
              <h3>Question {i + 1}</h3>
              <p>{q.question_text}</p>
              <div>
                {['A', 'B', 'C', 'D'].map(opt => (
                  <button
                    key={opt}
                    className={`option-btn ${answers[q.id] === opt ? 'selected' : ''}`}
                    onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                  >
                    <span className="option-label">{opt}</span>
                    {q[`option_${opt.toLowerCase()}`]}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              {questions.length - answeredCount} questions remaining
            </span>
            <button onClick={handleSubmit} className="btn btn-primary btn-lg" disabled={answeredCount === 0}>
              Submit Test →
            </button>
          </div>
        </div>
      ) : (
        <div className="quiz-container">
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
            {result?.error ? (
              <>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>⚠️</div>
                <h2>{result.error}</h2>
              </>
            ) : result ? (
              <>
                <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>
                  {result.percentage >= 80 ? '🏆' : result.percentage >= 50 ? '👍' : '📚'}
                </div>
                <h2 style={{ marginBottom: 'var(--space-4)' }}>Test Completed!</h2>
                <div style={{ fontFamily: 'Outfit', fontSize: '3rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--primary-400), var(--accent-400))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 'var(--space-2)' }}>
                  {result.score} / {result.total}
                </div>
                <div style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-8)' }}>
                  You scored {result.percentage}%
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
                  <button onClick={() => router.push('/student/assessments')} className="btn btn-primary">View All Tests</button>
                  <button onClick={() => router.push('/student/progress')} className="btn btn-secondary">View Progress</button>
                </div>
              </>
            ) : (
              <div className="loading-spinner" style={{width:40,height:40,margin:'0 auto'}}></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
