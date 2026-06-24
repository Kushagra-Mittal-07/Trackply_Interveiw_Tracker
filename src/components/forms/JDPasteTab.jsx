import React, { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

/**
 * JDPasteTab Component - Dark Theme
 * Renders the simulated JD parsing UI tab inside the Application dialog.
 * Simulates AI parsing of job description text using a 1.5-second loader.
 * 
 * Props:
 * - onExtractSuccess: callback function triggered after extraction finishes (function)
 */
export default function JDPasteTab({ onExtractSuccess }) {
  const [jdText, setJdText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleExtract = () => {
    if (!jdText.trim()) return;

    setLoading(true);

    // Simulate AI API call extraction latency (1.5 seconds)
    setTimeout(() => {
      setLoading(false);

      // Create rich mock extracted data matching the target fields
      const simulatedData = {
        company: "Vercel",
        role: "Frontend Engineer Intern",
        url: "https://vercel.com/careers/frontend-intern-role",
        // Format deadline date exactly as YYYY-MM-DD (e.g. 14 days from now)
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        status: "Applied",
        notes: `=== AI EXTRACTED DETAILS ===\nKey Skills: React, Next.js, Tailwind CSS, TypeScript.\nAbout: Join the core framework team supporting frontend developer experiences.\n\nDescription parsed on: ${new Date().toLocaleDateString()}`,
      };

      // Bubble up the details to pre-fill the form
      if (onExtractSuccess) {
        onExtractSuccess(simulatedData);
      }
    }, 1500);
  };

  return (
    <div className="space-y-4 pt-2 select-none bg-card text-foreground">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Job Description Text
        </label>
        <Textarea
          placeholder="Paste the full job description text here... (AI will automatically extract Company, Role, URL, and suggest notes)"
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          className="min-h-[200px] resize-y font-mono text-xs leading-relaxed border-border bg-secondary/30 text-foreground focus-visible:ring-primary placeholder:text-muted-foreground/50"
          disabled={loading}
        />
      </div>

      <Button
        onClick={handleExtract}
        disabled={loading || !jdText.trim()}
        className="w-full flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary/90 text-xs font-semibold uppercase tracking-wider py-2.5 h-auto transition-all"
      >
        {loading ? (
          <>
            <Loader2 className="h-4.5 w-4.5 animate-spin text-white" />
            <span className="text-white">Extracting Details with AI...</span>
          </>
        ) : (
          <>
            <Sparkles className="h-4.5 w-4.5 text-white" />
            <span className="text-white">Extract Details with AI</span>
          </>
        )}
      </Button>

      <div className="text-[10px] text-muted-foreground/60 text-center flex items-center justify-center gap-1">
        <span>No real API call is made. Simulation runs client-side.</span>
      </div>
    </div>
  );
}
