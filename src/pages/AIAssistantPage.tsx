import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Send,
  BookOpen,
  HelpCircle,
  Calendar,
  Copy,
  Check,
  RotateCcw,
  AlertCircle,
  FileText,
  Lightbulb,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldAlert,
  Loader2,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

interface QuizData {
  topic: string;
  difficulty: string;
  questions: QuizQuestion[];
}

interface StudyPlanMilestone {
  day: string;
  phase: string;
  topics: string[];
  actionItems: string[];
  timeAllocation: string;
}

interface StudyPlanData {
  subject: string;
  daysRemaining: number;
  totalEstimatedHours: number;
  schedule: StudyPlanMilestone[];
  highYieldTips: string[];
}

export const AIAssistantPage: React.FC = () => {
  const { showToast, isAiAvailable, checkAiStatus, currentRole } = useApp();

  const [activeTab, setActiveTab] = useState<'chat' | 'summarize' | 'quiz' | 'plan'>('chat');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 1. Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      role: 'model',
      content:
        `Hello! I am **Athena**, your Smart Campus AI Study Mentor powered by Gemini 3.8. 🎓\n\nI can help explain difficult academic concepts, debug algorithm logic, analyze database normalization, or clarify course lecture materials. How can I assist your study session today?`,
      timestamp: 'Just now',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // 2. Summarizer State
  const [notesText, setNotesText] = useState('');
  const [notesSubject, setNotesSubject] = useState('Design and Analysis of Algorithms');
  const [notesFormat, setNotesFormat] = useState('detailed');
  const [notesSummary, setNotesSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);

  // 3. Quiz State
  const [quizTopic, setQuizTopic] = useState('Design and Analysis of Algorithms: Dynamic Programming & Greedy');
  const [quizCount, setQuizCount] = useState(5);
  const [quizDifficulty, setQuizDifficulty] = useState('intermediate');
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [isQuizGenerating, setIsQuizGenerating] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

  // 4. Study Plan State
  const [planSubject, setPlanSubject] = useState('Database Management Systems (CS304)');
  const [planDays, setPlanDays] = useState(7);
  const [planHours, setPlanHours] = useState(3);
  const [planFocus, setPlanFocus] = useState('B-Trees, Concurrency Control, 3NF/BCNF Normalization, and Query Optimization');
  const [studyPlan, setStudyPlan] = useState<StudyPlanData | null>(null);
  const [isPlanGenerating, setIsPlanGenerating] = useState(false);

  useEffect(() => {
    checkAiStatus();
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatLoading]);

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied to clipboard', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // --- 1. CHAT HANDLER ---
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userText = chatInput.trim();
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: chatMessages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
          role: currentRole,
        }),
      });

      const data = await response.json();
      if (response.ok && data.reply) {
        setChatMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            role: 'model',
            content: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        const errMsg = data.error || 'Failed to connect to AI server.';
        setChatMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'model',
            content: `⚠️ **AI Service Notice**: ${errMsg}\n\n*Please ensure GEMINI_API_KEY is configured in the AI Studio environment.*`,
            timestamp: 'Just now',
          },
        ]);
      }
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'model',
          content: `⚠️ **Network Error**: Unable to reach backend study assistant. (${err.message})`,
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Preset prompt clicker
  const handlePresetPrompt = (prompt: string) => {
    setChatInput(prompt);
  };

  // --- 2. SUMMARIZE HANDLER ---
  const handleSummarize = async () => {
    if (!notesText.trim() || isSummarizing) return;
    setIsSummarizing(true);
    setNotesSummary('');

    try {
      const response = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: notesText,
          subject: notesSubject,
          format: notesFormat,
        }),
      });

      const data = await response.json();
      if (response.ok && data.summary) {
        setNotesSummary(data.summary);
        showToast('Lecture notes summarized successfully', 'success');
      } else {
        showToast(data.error || 'Failed to generate summary', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error communicating with AI service', 'error');
    } finally {
      setIsSummarizing(false);
    }
  };

  // Sample notes loader
  const handleLoadSampleNotes = () => {
    setNotesSubject('CS301 - Design and Analysis of Algorithms');
    setNotesText(
      `Lecture 14: Dynamic Programming & Optimal Substructure
Dynamic Programming (DP) is an algorithmic paradigm that solves problems by breaking them down into simpler subproblems and storing the results of subproblems to avoid recomputing them (memoization or tabulation).

Key Requirements for DP:
1. Optimal Substructure: An optimal solution to the problem contains optimal solutions to its subproblems.
2. Overlapping Subproblems: The problem can be broken down into subproblems which are reused several times.

Example: 0/1 Knapsack Problem
Given weights and values of n items, put these items in a knapsack of capacity W to get the maximum total value.
- Items cannot be broken (0 or 1 choice).
- State: dp[i][w] = maximum value using first i items with remaining capacity w.
- Recurrence relation:
  If weight[i-1] <= w:
    dp[i][w] = max(val[i-1] + dp[i-1][w - weight[i-1]], dp[i-1][w])
  Else:
    dp[i][w] = dp[i-1][w]
- Time Complexity: O(n * W)
- Space Complexity: O(n * W) which can be optimized to O(W) using a 1D rolling array.

Contrast with Greedy Approach:
Greedy choice works for Fractional Knapsack (sort by value/weight ratio), but FAILS for 0/1 Knapsack because leaving empty space in the knapsack might prevent taking higher value items later.`
    );
  };

  // --- 3. QUIZ GENERATOR HANDLER ---
  const handleGenerateQuiz = async () => {
    if (!quizTopic.trim() || isQuizGenerating) return;
    setIsQuizGenerating(true);
    setUserAnswers({});
    setIsQuizSubmitted(false);

    try {
      const response = await fetch('/api/ai/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: quizTopic,
          count: quizCount,
          difficulty: quizDifficulty,
        }),
      });

      const data = await response.json();
      if (response.ok && data.questions && data.questions.length > 0) {
        setQuizData(data);
        showToast(`Generated ${data.questions.length}-question quiz on ${quizTopic}!`, 'success');
      } else {
        showToast(data.error || 'Failed to generate quiz questions', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error calling quiz generator', 'error');
    } finally {
      setIsQuizGenerating(false);
    }
  };

  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    if (isQuizSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  // Calculate score
  const quizScore = quizData
    ? quizData.questions.reduce((score, q, idx) => {
        return userAnswers[idx] === q.correctAnswerIndex ? score + 1 : score;
      }, 0)
    : 0;

  // --- 4. STUDY PLAN HANDLER ---
  const handleGeneratePlan = async () => {
    if (!planSubject.trim() || isPlanGenerating) return;
    setIsPlanGenerating(true);

    try {
      const response = await fetch('/api/ai/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: planSubject,
          daysRemaining: planDays,
          dailyHours: planHours,
          focusTopics: planFocus,
        }),
      });

      const data = await response.json();
      if (response.ok && data.schedule && data.schedule.length > 0) {
        setStudyPlan(data);
        showToast(`Study plan for ${planSubject} generated!`, 'success');
      } else {
        showToast(data.error || 'Failed to generate study timetable', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error generating study roadmap', 'error');
    } finally {
      setIsPlanGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              AI Study Assistant
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 font-mono">
              <Sparkles className="w-3 h-3" />
              Gemini 3.8 Flash
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Intelligent academic mentor for lecture revision, quiz self-assessment, and exam roadmap planning.
          </p>
        </div>

        {/* AI Key Status Indicator */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isAiAvailable ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Gemini Engine Active</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Gemini API Key Needed</span>
            </div>
          )}
        </div>
      </div>

      {/* API Key Setup Banner if not configured */}
      {!isAiAvailable && (
        <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs space-y-2 shadow-2xs">
          <div className="flex items-center gap-2 font-bold text-amber-950">
            <ShieldAlert className="w-4 h-4 text-amber-700" />
            <span>AI Integration Notice: How to enable real-time Gemini generation</span>
          </div>
          <p className="leading-relaxed text-amber-900/90">
            To query live Gemini models, make sure your <strong>GEMINI_API_KEY</strong> is attached in your AI Studio project secrets. The application automatically communicates with <strong>gemini-3.8-flash</strong> through our secure Express server (<code>server.ts</code>), preventing API key exposure to client code.
          </p>
        </div>
      )}

      {/* Sub-tools Tab Navigation */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'chat'
              ? 'bg-white text-indigo-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Study Mentor Chat</span>
        </button>

        <button
          onClick={() => setActiveTab('summarize')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'summarize'
              ? 'bg-white text-indigo-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Notes Summarizer</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'quiz'
              ? 'bg-white text-indigo-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Quiz Generator</span>
        </button>

        <button
          onClick={() => setActiveTab('plan')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'plan'
              ? 'bg-white text-indigo-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Exam Study Planner</span>
        </button>
      </div>

      {/* --- TAB 1: CHAT TUTOR --- */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Chat Stream (3 cols) */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[650px] overflow-hidden">
            {/* Chat header */}
            <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  A
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Athena Academic Mentor</h3>
                  <p className="text-[10px] text-slate-500">Gemini 3.8 Flash · College Tutoring</p>
                </div>
              </div>

              <button
                onClick={() =>
                  setChatMessages([
                    {
                      id: `init-${Date.now()}`,
                      role: 'model',
                      content:
                        'Study chat history cleared. What topic or exam problem shall we work through next?',
                      timestamp: 'Just now',
                    },
                  ])
                }
                className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Chat</span>
              </button>
            </div>

            {/* Messages container */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {chatMessages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 font-bold text-xs mt-1">
                        AI
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed ${
                        isUser
                          ? 'bg-indigo-600 text-white rounded-br-xs'
                          : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-bl-xs'
                      }`}
                    >
                      <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

                      <div
                        className={`flex items-center justify-between mt-2 pt-1 border-t text-[10px] ${
                          isUser ? 'border-indigo-500/50 text-indigo-200' : 'border-slate-200 text-slate-400'
                        }`}
                      >
                        <span className="font-mono">{msg.timestamp}</span>
                        {!isUser && (
                          <button
                            onClick={() => handleCopy(msg.content, msg.id)}
                            className="hover:text-slate-700 flex items-center gap-1"
                            title="Copy reply"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>Copy</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {isUser && (
                      <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 font-bold text-xs mt-1">
                        You
                      </div>
                    )}
                  </div>
                );
              })}

              {isChatLoading && (
                <div className="flex items-center gap-2 p-3 text-xs text-indigo-600 bg-indigo-50/60 rounded-xl max-w-xs animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Athena is researching and formulating response...</span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about dynamic programming, BCNF decomposition, OS semaphores, or calculus..."
                className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isChatLoading}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Quick Prompts Sidebar (1 col) */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-3">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Suggested Study Prompts</span>
              </div>
              <div className="space-y-2">
                {[
                  'Explain Dijkstra vs Bellman-Ford algorithm with time complexity',
                  'What is 3NF vs BCNF database normalization with an example?',
                  'How do counting semaphores prevent race conditions in Operating Systems?',
                  'Explain Backpropagation and gradient descent in neural networks',
                  'Derive the time complexity of QuickSort average vs worst case',
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePresetPrompt(prompt)}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200/80 hover:border-indigo-200 text-[11px] text-slate-700 font-medium transition-colors leading-snug"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-4 text-xs text-indigo-900">
              <span className="font-bold block mb-1">Study Tip</span>
              <p className="leading-relaxed text-indigo-800 text-[11px]">
                You can ask the tutor to write runnable code in Python, C++, or Java, or explain difficult mathematical proofs step-by-step.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: NOTES SUMMARIZER --- */}
      {activeTab === 'summarize' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Lecture Notes Input</h3>
              </div>
              <button
                type="button"
                onClick={handleLoadSampleNotes}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 underline"
              >
                Load Sample DP Notes
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Course / Subject</label>
              <input
                type="text"
                value={notesSubject}
                onChange={(e) => setNotesSubject(e.target.value)}
                placeholder="e.g. CS301 - Design and Analysis of Algorithms"
                className="w-full px-3 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Summary Format</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'detailed', label: 'Detailed Breakdown' },
                  { id: 'bullet_points', label: 'Quick Bullet Points' },
                  { id: 'exam_cram', label: 'Exam Hotspots Only' },
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setNotesFormat(fmt.id)}
                    className={`p-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                      notesFormat === fmt.id
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Raw Notes / Textbook Excerpt
              </label>
              <textarea
                rows={12}
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                placeholder="Paste course slides, syllabus topics, or textbook paragraphs here..."
                className="w-full px-3.5 py-2.5 text-xs border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed font-mono"
              />
            </div>

            <button
              onClick={handleSummarize}
              disabled={!notesText.trim() || isSummarizing}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {isSummarizing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Academic Takeaways...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Structured Summary</span>
                </>
              )}
            </button>
          </div>

          {/* Output Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-sm font-bold text-slate-900">Synthesized Summary</h3>
                {notesSummary && (
                  <button
                    onClick={() => handleCopy(notesSummary, 'summary-text')}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    {copiedId === 'summary-text' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Text</span>
                  </button>
                )}
              </div>

              {notesSummary ? (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs leading-relaxed text-slate-800 whitespace-pre-wrap max-h-[500px] overflow-y-auto">
                  {notesSummary}
                </div>
              ) : (
                <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center h-80">
                  <BookOpen className="w-8 h-8 text-slate-300 mb-2" />
                  <span>Your structured key takeaways and exam revision pointers will appear here.</span>
                </div>
              )}
            </div>

            {notesSummary && (
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Subject: {notesSubject}</span>
                <span className="font-mono">Generated by Gemini 3.8</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB 3: QUIZ GENERATOR --- */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          {/* Quiz Configuration Bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Configure Practice Quiz</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Topic</label>
                <input
                  type="text"
                  value={quizTopic}
                  onChange={(e) => setQuizTopic(e.target.value)}
                  placeholder="e.g. Operating Systems Concurrency & Deadlocks"
                  className="w-full px-3 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Question Count</label>
                <select
                  value={quizCount}
                  onChange={(e) => setQuizCount(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                >
                  <option value={3}>3 Questions (Quick Drill)</option>
                  <option value={5}>5 Questions (Standard)</option>
                  <option value={10}>10 Questions (Mock Exam)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Difficulty</label>
                <select
                  value={quizDifficulty}
                  onChange={(e) => setQuizDifficulty(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none capitalize"
                >
                  <option value="beginner">Beginner (Foundations)</option>
                  <option value="intermediate">Intermediate (College Standard)</option>
                  <option value="advanced">Advanced (Deep Conceptual)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerateQuiz}
              disabled={isQuizGenerating || !quizTopic.trim()}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2"
            >
              {isQuizGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Drafting Questions with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Practice Quiz</span>
                </>
              )}
            </button>
          </div>

          {/* Active Quiz Runner */}
          {quizData && quizData.questions && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{quizData.topic}</h3>
                  <p className="text-xs text-slate-500 capitalize">
                    {quizData.difficulty} Level · {quizData.questions.length} Multiple Choice Questions
                  </p>
                </div>

                {isQuizSubmitted && (
                  <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold font-mono">
                    <span>
                      Score: {quizScore} / {quizData.questions.length} (
                      {Math.round((quizScore / quizData.questions.length) * 100)}%)
                    </span>
                  </div>
                )}
              </div>

              {/* Questions List */}
              <div className="space-y-6">
                {quizData.questions.map((q, qIndex) => {
                  const selectedOption = userAnswers[qIndex];
                  const hasAnswered = selectedOption !== undefined;

                  return (
                    <div
                      key={q.id || qIndex}
                      className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {qIndex + 1}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                          {q.question}
                        </h4>
                      </div>

                      {/* Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 pl-8">
                        {q.options.map((option, optIndex) => {
                          const isSelected = selectedOption === optIndex;
                          const isCorrect = optIndex === q.correctAnswerIndex;

                          let optionStyle =
                            'bg-white text-slate-700 border-slate-200 hover:bg-slate-100/80';
                          if (isQuizSubmitted) {
                            if (isCorrect) {
                              optionStyle = 'bg-emerald-50 text-emerald-800 border-emerald-400 font-bold';
                            } else if (isSelected && !isCorrect) {
                              optionStyle = 'bg-rose-50 text-rose-800 border-rose-400';
                            }
                          } else if (isSelected) {
                            optionStyle = 'bg-indigo-50 text-indigo-800 border-indigo-500 font-bold';
                          }

                          return (
                            <button
                              key={optIndex}
                              type="button"
                              onClick={() => handleSelectOption(qIndex, optIndex)}
                              className={`p-3 text-left text-xs rounded-xl border transition-all flex items-center justify-between ${optionStyle}`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-[11px] text-slate-400 uppercase">
                                  {String.fromCharCode(65 + optIndex)}.
                                </span>
                                <span>{option}</span>
                              </div>

                              {isQuizSubmitted && isCorrect && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              )}
                              {isQuizSubmitted && isSelected && !isCorrect && (
                                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation box after submit */}
                      {isQuizSubmitted && (
                        <div className="mt-3 p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 pl-8">
                          <strong className="text-slate-900 block mb-0.5">Explanation:</strong>
                          <p className="leading-relaxed text-[11px] text-slate-600">
                            {q.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Submit / Reset Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-500">
                  {Object.keys(userAnswers).length} of {quizData.questions.length} answered
                </span>

                <div className="flex items-center gap-2">
                  {!isQuizSubmitted ? (
                    <button
                      onClick={() => setIsQuizSubmitted(true)}
                      disabled={Object.keys(userAnswers).length === 0}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                    >
                      Submit & Review Explanations
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setUserAnswers({});
                        setIsQuizSubmitted(false);
                      }}
                      className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                    >
                      Retake Quiz
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- TAB 4: STUDY PLAN GENERATOR --- */}
      {activeTab === 'plan' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Exam Preparation Roadmap Parameters</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Subject</label>
                <input
                  type="text"
                  value={planSubject}
                  onChange={(e) => setPlanSubject(e.target.value)}
                  placeholder="e.g. Database Management Systems"
                  className="w-full px-3 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Days Until Exam</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={planDays}
                  onChange={(e) => setPlanDays(parseInt(e.target.value, 10) || 7)}
                  className="w-full px-3 py-2 text-xs border rounded-xl font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Hours / Day</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={planHours}
                  onChange={(e) => setPlanHours(parseInt(e.target.value, 10) || 3)}
                  className="w-full px-3 py-2 text-xs border rounded-xl font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Focus Topics / Weak Areas</label>
                <input
                  type="text"
                  value={planFocus}
                  onChange={(e) => setPlanFocus(e.target.value)}
                  placeholder="e.g. B-Trees, Concurrency Control, 3NF/BCNF Normalization"
                  className="w-full px-3 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleGeneratePlan}
              disabled={isPlanGenerating || !planSubject.trim()}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2"
            >
              {isPlanGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Milestone Timetable...</span>
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4" />
                  <span>Generate Personalized Study Roadmap</span>
                </>
              )}
            </button>
          </div>

          {/* Generated Plan Display */}
          {studyPlan && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{studyPlan.subject} Study Plan</h3>
                  <p className="text-xs text-slate-500">
                    {studyPlan.daysRemaining} Days Countdown · Total Study Commitment: ~{studyPlan.totalEstimatedHours} Hours
                  </p>
                </div>
              </div>

              {/* Day-by-day Milestones */}
              <div className="space-y-4">
                {studyPlan.schedule.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-start justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-indigo-600 text-white font-mono font-bold text-xs">
                          {item.day}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900">{item.phase}</h4>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-slate-500 block">Focus Topics:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {item.topics.map((t, tidx) => (
                            <span
                              key={tidx}
                              className="px-2 py-0.5 bg-white text-slate-800 rounded text-[11px] border border-slate-200 font-medium"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1 pt-1">
                        <span className="text-[11px] font-semibold text-slate-500 block">Deliverables & Action Items:</span>
                        <ul className="list-disc list-inside text-xs text-slate-700 space-y-0.5">
                          {item.actionItems.map((ai, aidx) => (
                            <li key={aidx}>{ai}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="shrink-0 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold text-indigo-600">
                      {item.timeAllocation}
                    </div>
                  </div>
                ))}
              </div>

              {/* Exam High Yield Tips */}
              {studyPlan.highYieldTips && studyPlan.highYieldTips.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-2">
                  <div className="font-bold flex items-center gap-1.5 text-amber-950">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <span>High-Yield Exam Strategy Takeaways</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-amber-800 text-[11px]">
                    {studyPlan.highYieldTips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
