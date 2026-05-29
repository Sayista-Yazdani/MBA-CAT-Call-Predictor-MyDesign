import { useState, useRef, useEffect } from 'react';
import type { CandidateProfile, BSchoolPrediction } from '../types';

interface AICounsellorProps {
  profile: CandidateProfile | null;
  predictions: BSchoolPrediction[];
}

interface Message {
  sender: 'ai' | 'user';
  text: string;
}

export function AICounsellor({ profile, predictions }: AICounsellorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: 'Namaste! I am your AI MBA Mentor. Click any suggestion below or ask me anything about your CAT score, profile composite weight, or WAT-PI interview prep!' }
  ]);
  const [inputText, setInputText] = useState('');
  const [interviewStep, setInterviewStep] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateAIResponse = (userMsg: string): string => {
    const msg = userMsg.toLowerCase();

    // 1. Handle WAT-PI Mock Interview Coach Simulation
    if (interviewStep === 1) {
      setInterviewStep(2);
      let feedback = "";
      if (profile?.undergradStream === 'Engineering') {
        feedback = "<strong>AI Feedback:</strong> Solid effort! Your engineering focus is visible. However, you should emphasize leadership and business applications more than raw technical data. <strong>Score: 8/10</strong>.";
      } else {
        feedback = "<strong>AI Feedback:</strong> Excellent structured response! Utilizing your non-engineering diversity perspective is your primary competitive edge. Keep emphasizing cohort diversity points. <strong>Score: 9/10</strong>.";
      }
      return `Thank you for your response! Here is my analysis:<br/><br/>${feedback}<br/><br/>Ask me another question or say "mock interview" to practice again!`;
    }

    if (msg.includes('mock') || msg.includes('interview') || msg.includes('pi') || msg.includes('wat')) {
      setInterviewStep(1);
      if (profile?.undergradStream === 'Engineering') {
        return `Let's start your WAT-PI Mock Interview for Top IIMs! 🎤<br/><br/><strong>Question:</strong> "Since you have a standard General Engineering Male (GEM) background with 0 academic diversity points, why do you think you deserve a seat over a highly diverse non-engineering candidate? How will you contribute to the cohort?"<br/><br/>Type your response below to get graded!`;
      } else if (profile?.gender === 'Female' || profile?.gender === 'Other') {
        return `Let's start your WAT-PI Mock Interview! 🎤<br/><br/><strong>Question:</strong> "Your profile holds valuable diversity credentials. How do you plan to leverage your background to add value in a predominantly math-heavy IIM cohort during technical placements?"<br/><br/>Type your response below to get graded!`;
      } else {
        return `Let's start your WAT-PI Mock Interview! 🎤<br/><br/><strong>Question:</strong> "What is your primary motivation behind pursuing an MBA at this stage of your career, and how does it align with your long-term professional milestones?"<br/><br/>Type your response below to get graded!`;
      }
    }

    // 2. Handle specific sectional queries (VARC, DILR, QA)
    if (msg.includes('qa') || msg.includes('quant')) {
      const qaScore = profile?.catQA || 0;
      if (qaScore > 0 && qaScore < 80) {
        return `Your current QA percentile is <strong>${qaScore}%</strong>. This is slightly close to top B-school cutoffs (e.g. Bangalore requires 75%, Lucknow requires 85%). I highly recommend prioritizing Arithmetic and Algebra mocks to create a safe 10% score buffer!`;
      }
      return `To secure elite B-school calls, a minimum sectional percentile of <strong>75% to 80%</strong> in QA is mandatory for General candidates. Focus heavily on speed-solving high-yield chapters (Arithmetic, Geometry, and Algebra).`;
    }

    if (msg.includes('dilr') || msg.includes('reasoning')) {
      const dilrScore = profile?.catDILR || 0;
      if (dilrScore > 0 && dilrScore < 80) {
        return `Your DILR is currently at <strong>${dilrScore}%</strong>. Top cutoffs hover around 75-80%. DILR is historically a high-variance section; aim to solve at least 2 complete sets with 100% accuracy in mocks to stay secure!`;
      }
      return `DILR sectional cutoffs typically require a minimum of <strong>75-80 percentile</strong>. Practice mixed sets (Matrix arrangements, Venn diagrams, and Games & Tournaments) daily under timed conditions to improve set selection skills.`;
    }

    if (msg.includes('varc') || msg.includes('verbal')) {
      const varcScore = profile?.catVARC || 0;
      if (varcScore > 0 && varcScore < 80) {
        return `Your VARC is at <strong>${varcScore}%</strong>. Top B-schools require 75-80%. Boost your score by focusing on RC accuracy and elimination techniques for Summary/Odd-One-Out questions in mock audits.`;
      }
      return `Elite IIMs require <strong>75% to 80%</strong> in VARC. Spend 70% of your time practicing reading comprehension (RCs) from diverse topics (Philosophy, Science, Economics) to adapt to CAT reading formats.`;
    }

    // 3. Handle specific B-school queries
    if (msg.includes('ahmedabad') || msg.includes('iima')) {
      const aPred = predictions.find(p => p.college.includes("Ahmedabad"));
      if (aPred) {
        return `<strong>IIM Ahmedabad Analysis:</strong><br/><br/>Status: <strong>${aPred.status}</strong><br/>Call Probability: <strong>${aPred.chance ? aPred.chance + '%' : 'N/A'}</strong><br/><br/>Ahmedabad utilizes a strict composite formula. Since your profile score is ${aPred.profileScore.toFixed(1)}/60, you need to score extremely high in CAT to make up for any academic gaps.`;
      }
      return `IIM Ahmedabad overall cutoff stands at <strong>99.0%</strong> for General candidates, but the actual shortlisting composite score factors in 10th, 12th, and UG percentages heavily.`;
    }

    if (msg.includes('bangalore') || msg.includes('iimb')) {
      const bPred = predictions.find(p => p.college.includes("Bangalore"));
      if (bPred) {
        return `<strong>IIM Bangalore Analysis:</strong><br/><br/>Status: <strong>${bPred.status}</strong><br/>Call Probability: <strong>${bPred.chance ? bPred.chance + '%' : 'N/A'}</strong><br/><br/>Bangalore awards massive weight to professional work experience (max 10 points). Your work-ex points are calculated as a bell-curve, highly favoring candidates with 22-36 months.`;
      }
      return `IIM Bangalore requires a minimum of <strong>98.5%</strong> overall with high sectional cutoffs (VARC: 80%, DILR: 75%, QA: 75%). Work experience holds crucial composite weight here.`;
    }

    // 4. Handle general profile audit query
    if (msg.includes('profile') || msg.includes('audit') || msg.includes('score') || msg.includes('strength')) {
      if (!profile) {
        return "Please fill out and submit the Predictor Form first so I can analyze your unique profile parameters!";
      }

      const pScore = predictions[0]?.profileScore || 0;
      let review = `Your calculated profile composite weight is <strong>${pScore.toFixed(1)}/60</strong>.<br/><br/>`;

      if (pScore >= 35) {
        review += `🌟 <strong>Outstanding Profile!</strong> You have an exceptional academic and professional foundation. This high weight acts as a cushion, lowering your target CAT percentile requirements.`;
      } else if (pScore >= 22) {
        review += `👍 <strong>Solid Profile:</strong> A balanced academic record. Maintain a target CAT percentile of at least 1-1.5% above B-school base cutoffs to be completely secure.`;
      } else {
        review += `⚠️ <strong>Academic Challenge:</strong> A lower profile weight means you face higher competition. You must aim to exceed target cutoffs by 2-3 percentile to offset profile deficits.`;
      }

      return review;
    }

    // Default expert response
    return `I received your query. To help you best, you can check:<br/><br/>1. Ask **"profile audit"** to see your composite scorecard analysis.<br/>2. Ask **"mock interview"** to start a real-time WAT-PI mock prep!<br/>3. Ask **"IIM Ahmedabad"** or **"IIM Bangalore"** for college-specific shortlisting tips.<br/>4. Ask **"QA"**, **"DILR"**, or **"VARC"** for mock preparation strategies.`;
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = { sender: 'user', text: inputText };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Synthetic dynamic typing delay (350ms)
    setTimeout(() => {
      const responseText = generateAIResponse(inputText);
      setMessages(prev => [...prev, { sender: 'ai', text: responseText }]);
    }, 450);
  };

  const handleSuggestionClick = (pillText: string) => {
    const userMessage: Message = { sender: 'user', text: pillText };
    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const responseText = generateAIResponse(pillText);
      setMessages(prev => [...prev, { sender: 'ai', text: responseText }]);
    }, 450);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Launcher Button */}
      <button
        className="ai-chat-launcher"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open AI Counsellor"
      >
        {isOpen ? <i className="fas fa-times fa-lg"></i> : <i className="fas fa-robot fa-lg"></i>}
      </button>

      {/* Chat Drawer */}
      {isOpen && (
        <div className="ai-chat-drawer">
          <div className="ai-chat-header">
            <div className="d-flex align-items-center gap-2">
              <i className="fas fa-brain text-warning"></i>
              <h6 className="fw-bold mb-0">AI MBA Mentor</h6>
            </div>
            <button
              className="btn btn-sm btn-link text-white p-0 border-0"
              onClick={() => setIsOpen(false)}
            >
              <i className="fas fa-minus"></i>
            </button>
          </div>

          <div className="ai-chat-messages">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`chat-bubble ${m.sender === 'ai' ? 'chat-bubble-ai' : 'chat-bubble-user'}`}
                dangerouslySetInnerHTML={{ __html: m.text }}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div className="p-2 bg-white border-top">
            <div className="chat-suggestions">
              <span className="suggestion-pill" onClick={() => handleSuggestionClick("Profile Audit")}>
                <i className="fas fa-address-card me-1"></i> Profile Audit
              </span>
              <span className="suggestion-pill" onClick={() => handleSuggestionClick("Mock Interview")}>
                <i className="fas fa-microphone me-1"></i> Mock Interview
              </span>
              <span className="suggestion-pill" onClick={() => handleSuggestionClick("DILR strategy")}>
                <i className="fas fa-lightbulb me-1"></i> DILR Strategy
              </span>
            </div>
          </div>

          <div className="ai-chat-input-area">
            <input
              type="text"
              className="form-control form-control-sm border-secondary-subtle rounded-pill py-2 px-3"
              placeholder="Ask about cutoffs, profile..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              className="btn btn-sm btn-primary rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: '36px', height: '36px' }}
              onClick={handleSendMessage}
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
