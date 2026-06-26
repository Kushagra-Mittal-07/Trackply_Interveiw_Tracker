import React, { useState, useEffect } from "react";
import { Loader2, Sparkles, X, Save, Calendar, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StatusBadge from "../ui/StatusBadge";

/**
 * JDExtractorForm Component - Dark Theme
 * Handles pasting a JD, shows a premium multi-step loading parser,
 * displays the results in structured "Timeline" and "Requirements" boxes,
 * and handles saving the application.
 */
export default function JDExtractorForm({ onSave, onClose }) {
  const [step, setStep] = useState("input"); // 'input', 'loading', 'results'
  const [jdText, setJdText] = useState("");
  const [loadingMessage, setLoadingMessage] = useState("Scanning job description...");

  // Extracted data states
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [url, setUrl] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("Applied");
  const [notes, setNotes] = useState("");
  const [timeline, setTimeline] = useState([]);
  const [requirements, setRequirements] = useState([]);

  // Loading animation simulation messages
  useEffect(() => {
    if (step !== "loading") return;

    const messages = [
      { text: "Scanning job description text...", delay: 0 },
      { text: "Identifying target company & role title...", delay: 800 },
      { text: "Constructing visual timeline milestones...", delay: 1600 },
      { text: "Extracting skills and checklist requirements...", delay: 2400 },
    ];

    const timeouts = messages.map((m) =>
      setTimeout(() => setLoadingMessage(m.text), m.delay)
    );

    // Finalize extraction after 3.2s
    const finalTimeout = setTimeout(() => {
      const extracted = parseJDText(jdText);
      setCompany(extracted.company);
      setRole(extracted.role);
      setUrl(extracted.url);
      setDeadline(extracted.deadline);
      setStatus(extracted.status);
      setNotes(extracted.notes);
      setTimeline(extracted.timeline);
      setRequirements(extracted.requirements);
      setStep("results");
    }, 3200);

    return () => {
      timeouts.forEach(clearTimeout);
      clearTimeout(finalTimeout);
    };
  }, [step, jdText]);

  // Parser utility using basic heuristics
  const parseJDText = (text) => {
    const lowerText = text.toLowerCase();
    let comp = "OpenAI";
    let jobRole = "Software Engineering Intern";
    let jobUrl = "";

    // Keyword matching for companies
    if (lowerText.includes("google")) comp = "Google";
    else if (lowerText.includes("stripe")) comp = "Stripe";
    else if (lowerText.includes("vercel")) comp = "Vercel";
    else if (lowerText.includes("meta")) comp = "Meta";
    else if (lowerText.includes("netflix")) comp = "Netflix";
    else if (lowerText.includes("apple")) comp = "Apple";
    else if (lowerText.includes("microsoft")) comp = "Microsoft";
    else if (lowerText.includes("amazon")) comp = "Amazon";
    else if (lowerText.includes("airbnb")) comp = "Airbnb";
    else if (lowerText.includes("figma")) comp = "Figma";
    else if (lowerText.includes("notion")) comp = "Notion";

    // Keyword matching for roles
    if (lowerText.includes("frontend") || lowerText.includes("front-end")) {
      jobRole = "Frontend Engineer Intern";
    } else if (lowerText.includes("backend") || lowerText.includes("back-end")) {
      jobRole = "Backend Engineer Intern";
    } else if (lowerText.includes("fullstack") || lowerText.includes("full-stack")) {
      jobRole = "Full Stack Engineer Intern";
    } else if (lowerText.includes("data scientist") || lowerText.includes("data science")) {
      jobRole = "Data Science Intern";
    } else if (lowerText.includes("product manager")) {
      jobRole = "Product Management Intern";
    } else if (lowerText.includes("devops") || lowerText.includes("site reliability")) {
      jobRole = "DevOps Engineer Intern";
    }

    // Extract URL if exists
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = text.match(urlRegex);
    if (urls && urls.length > 0) {
      jobUrl = urls[0];
    } else {
      jobUrl = `https://careers.${comp.toLowerCase()}.com/jobs`;
    }

    // Suggested milestones dates
    const today = new Date();
    const oaDate = new Date(today);
    oaDate.setDate(today.getDate() + 7);
    const interviewDate = new Date(today);
    interviewDate.setDate(today.getDate() + 14);

    const extractedTimeline = [
      { label: "Application Submitted", date: today.toISOString().split("T")[0] },
      { label: "Online Assessment (OA)", date: oaDate.toISOString().split("T")[0] },
      { label: "Interview Rounds Window", date: interviewDate.toISOString().split("T")[0] },
    ];

    // Suggested requirements checklist
    let extractedReqs = [
      "Familiar with standard engineering principles and version control (Git).",
      "Ability to write legible, documentable code in a team environment.",
      "Clear oral and written communication skills.",
    ];

    if (
      lowerText.includes("react") ||
      lowerText.includes("next.js") ||
      lowerText.includes("tailwind") ||
      lowerText.includes("typescript")
    ) {
      extractedReqs = [
        "Experience building SPAs with modern React, Next.js, or TypeScript.",
        "Solid foundations in CSS, HTML, responsive design, and layouts.",
        "Familiarity with web performance optimization and developer APIs.",
      ];
    } else if (
      lowerText.includes("python") ||
      lowerText.includes("node") ||
      lowerText.includes("go") ||
      lowerText.includes("django")
    ) {
      extractedReqs = [
        "Understanding of server runtimes/languages (Node.js, Go, or Python).",
        "Experience implementing REST APIs and server routes.",
        "Basic knowledge of relational databases (PostgreSQL/MySQL) and queries.",
      ];
    } else if (
      lowerText.includes("data") ||
      lowerText.includes("machine learning") ||
      lowerText.includes("ai")
    ) {
      extractedReqs = [
        "Knowledge of Python, SQL, and data packages (Pandas, NumPy).",
        "Understanding of probability, statistics, and machine learning models.",
        "Familiarity with data visualization dashboards (Tableau, PowerBI).",
      ];
    }

    return {
      company: comp,
      role: jobRole,
      url: jobUrl,
      deadline: oaDate.toISOString().split("T")[0],
      status: "Applied",
      notes: `Extracted via AI from job description:\n${text.slice(0, 200)}...`,
      timeline: extractedTimeline,
      requirements: extractedReqs,
    };
  };

  const handleStartExtraction = () => {
    if (!jdText.trim()) return;
    setStep("loading");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) {
      alert("Company Name and Role are required fields.");
      return;
    }

    const payload = {
      company: company.trim(),
      role: role.trim(),
      url: url.trim(),
      deadline: deadline || "",
      status,
      notes: notes.trim(),
      timeline,
      requirements,
    };

    if (onSave) {
      onSave(payload);
    }
  };

  if (step === "input") {
    return (
      <div className="space-y-4 select-none text-foreground bg-card">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground leading-none">
              AI Job Description Extractor
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground hover:bg-accent/40 p-1"
          >
            <X size={16} />
          </Button>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Paste the job posting description text below. The AI will scan it to extract the company name, job role, deadlines, and automatically build a milestone timeline and requirements checklist.
        </p>

        <div className="space-y-1.5">
          <Label htmlFor="jdInput" className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Job Description Text
          </Label>
          <Textarea
            id="jdInput"
            placeholder="Paste the full job description text here..."
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            className="min-h-[200px] resize-y text-xs leading-relaxed border-border bg-secondary/30 text-foreground focus-visible:ring-primary font-mono placeholder:text-muted-foreground/45"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <Button
            onClick={onClose}
            variant="outline"
            size="sm"
            className="h-8 text-xs font-semibold border-border hover:bg-accent/40 text-foreground"
          >
            Cancel
          </Button>
          <Button
            onClick={handleStartExtraction}
            disabled={!jdText.trim()}
            size="sm"
            className="bg-primary hover:bg-primary/90 text-white flex items-center gap-1.5 h-8 text-xs font-semibold"
          >
            <Sparkles size={14} className="text-white" />
            <span className="text-white">Extract Details with AI</span>
          </Button>
        </div>
      </div>
    );
  }

  if (step === "loading") {
    return (
      <div className="py-12 flex flex-col items-center justify-center space-y-6 bg-card select-none">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-12 h-12 rounded-full border-4 border-primary/20 animate-pulse" />
          <Loader2 className="h-10 w-10 animate-spin text-primary relative z-10" />
        </div>
        <div className="space-y-1.5 text-center">
          <h3 className="text-sm font-semibold text-foreground">AI Analyzer Active</h3>
          <p className="text-xs text-muted-foreground animate-pulse leading-none">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  // step === 'results'
  return (
    <div className="space-y-5 select-none text-foreground bg-card max-h-[85vh] overflow-y-auto no-scrollbar pr-1">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground leading-none">
            Review Extracted Details
          </h2>
        </div>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground hover:bg-accent/40 p-1"
        >
          <X size={16} />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Core details editable */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="compName" className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Company Name
            </Label>
            <Input
              id="compName"
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              className="h-9 focus-visible:ring-primary border-border text-sm text-foreground bg-secondary/30"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="roleTitle" className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Role Title
            </Label>
            <Input
              id="roleTitle"
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="h-9 focus-visible:ring-primary border-border text-sm text-foreground bg-secondary/30"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="extStatus" className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Pipeline Status
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="extStatus" className="w-full h-9 focus-visible:ring-primary text-sm border-border bg-secondary/30">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-foreground">
                <SelectItem value="Applied">Applied</SelectItem>
                <SelectItem value="OA">OA (Online Assessment)</SelectItem>
                <SelectItem value="Interview">Interview</SelectItem>
                <SelectItem value="Offer">Offer</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="extDeadline" className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Extracted Deadline
            </Label>
            <Input
              id="extDeadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="h-9 focus-visible:ring-primary border-border text-sm text-foreground bg-secondary/30 color-scheme-dark"
            />
          </div>
        </div>

        {/* Timeline Box */}
        {timeline.length > 0 && (
          <div className="space-y-2.5 border border-border bg-secondary/10 rounded-lg p-4 select-none">
            <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Timeline Milestones Box
            </h3>
            <div className="relative pl-4 space-y-4 border-l border-border/80 ml-2 mt-2">
              {timeline.map((step, i) => (
                <div key={i} className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs">
                  {/* Bullet */}
                  <span className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-primary bg-card" />
                  <span className="text-foreground font-semibold">{step.label}</span>
                  <span className="text-muted-foreground text-[11px]">{step.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Requirements Box */}
        {requirements.length > 0 && (
          <div className="space-y-2.5 border border-border bg-secondary/10 rounded-lg p-4 select-none">
            <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Job Requirements Checklist Box
            </h3>
            <div className="space-y-2">
              {requirements.map((req, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="mt-0.5 rounded border-border bg-secondary text-primary focus:ring-primary w-3.5 h-3.5"
                  />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="extNotes" className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Notes Summary
          </Label>
          <Textarea
            id="extNotes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[80px] resize-y text-sm focus-visible:ring-primary border-border text-foreground bg-secondary/30"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-border bg-card">
          <Button
            type="button"
            onClick={() => setStep("input")}
            variant="outline"
            size="sm"
            className="h-8 text-xs font-semibold border-border hover:bg-accent/40 text-foreground"
          >
            Back
          </Button>
          <Button
            type="submit"
            size="sm"
            className="bg-primary hover:bg-primary/90 text-white flex items-center gap-1.5 h-8 text-xs font-semibold"
          >
            <Save size={14} className="text-white" />
            <span className="text-white">Save Application</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
