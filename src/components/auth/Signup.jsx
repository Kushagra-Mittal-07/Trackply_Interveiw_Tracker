import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Briefcase, User, Mail, Lock, Eye, EyeOff, Sparkles, History, PhoneCall, ArrowRight, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Signup Component - Split Screen Marketing & Signup Form
 * Displays Trackply features and support details on the left,
 * and the registration form on the right.
 * 
 * Routing:
 * - Links to "/login"
 * - Navigates to "/login" upon clicking "Sign Up"
 */
export default function Signup() {
  const navigate = useNavigate();
  
  // Local input states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Password visibility triggers
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      alert("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    
    // Simulate successful registration and navigate back to login screen
    alert("Account created successfully! Please log in.");
    navigate("/login");
  };

  return (
    <div className="min-h-screen md:h-screen bg-background text-foreground flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">
      
      {/* LEFT PANEL: Trackply Features, Ratings & Support (Visible on md+) */}
      <div className="hidden md:flex md:w-1/2 lg:w-1/2 bg-sidebar border-r border-border p-12 flex-col justify-between select-none md:h-full md:overflow-y-auto">
        
        {/* Top Branding Section */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <Briefcase size={20} className="stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight leading-none">
              Trackply
            </h1>
            <p className="text-[10px] text-muted-foreground font-medium mt-0.5">
              Phase 1 Frontend UI Workspace
            </p>
          </div>
        </div>

        {/* Middle Marketing Section */}
        <div className="my-auto py-10 space-y-8 max-w-lg">
          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground leading-tight">
              Track every job application.<br />
              <span className="text-primary">Miss nothing.</span>
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Trackply is a dedicated application tracker built specifically for students managing multiple internships, online assessments, and interview rounds.
            </p>
          </div>

          {/* Features Checklist */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Core Capabilities
            </h3>
            
            <div className="space-y-3.5">
              {/* Feature 1 */}
              <div className="flex gap-3">
                <div className="p-1 rounded bg-primary/10 text-primary h-fit">
                  <LayoutDashboard size={15} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Pipeline Visualization</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Track statuses (Applied, Screening, OA, Interview, Offer, Rejected) chronologically.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex gap-3">
                <div className="p-1 rounded bg-primary/10 text-primary h-fit">
                  <Sparkles size={15} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">AI Job Details Autofill (Simulation)</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Paste raw job description texts to instantly extract titles and auto-populate cards.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex gap-3">
                <div className="p-1 rounded bg-primary/10 text-primary h-fit">
                  <History size={15} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Chronological Activity Timelines</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Maintain a logs timeline tracking every creation, status shift, and deletion.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Care / Support */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="p-2 rounded bg-zinc-900 border border-border">
              <PhoneCall size={14} className="text-primary" />
            </div>
            <div>
              <span className="font-semibold text-foreground block">Dedicated Customer Care</span>
              <span className="text-[11px] mt-0.5 block">
                Have questions? Reach our support team 24/7 at <a href="mailto:support@trackply.com" className="text-primary hover:underline font-medium">support@trackply.com</a>
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-[10px] text-muted-foreground/50 border-t border-border/40 pt-4">
          <span>&copy; {new Date().getFullYear()} Trackply. All rights reserved. Made for students.</span>
        </div>

      </div>

      {/* RIGHT PANEL: Credentials Signup Form */}
      <div className="w-full md:w-1/2 lg:w-1/2 flex items-center justify-center p-8 bg-background md:h-full md:overflow-y-auto">
        <div className="w-full max-w-[420px] space-y-6">
          
          {/* Brand header for mobile layout (hidden on desktop) */}
          <div className="flex flex-col items-center text-center space-y-2 md:hidden">
            <div className="w-11 h-11 rounded-lg bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Briefcase size={22} className="stroke-[2.5]" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Create an Account
            </h1>
            <p className="text-xs text-muted-foreground">
              Start tracking your applications in seconds
            </p>
          </div>

          {/* Desktop Heading Form info */}
          <div className="hidden md:block space-y-1">
            <h2 className="text-2xl font-bold text-foreground">
              Create an Account
            </h2>
            <p className="text-sm text-muted-foreground">
              Fill in details below to register your workspace.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-card border border-border p-6 rounded-xl shadow-xl space-y-4">
            <form onSubmit={handleSignup} className="space-y-4">
              
              {/* Full Name */}
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Full Name
                </Label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="h-11 pl-10 focus-visible:ring-primary border-border bg-secondary/20 text-base text-foreground"
                  />
                </div>
              </div>

              {/* Email address */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Email address
                </Label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 pl-10 focus-visible:ring-primary border-border bg-secondary/20 text-base text-foreground"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Password
                </Label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 pl-10 pr-10 focus-visible:ring-primary border-border bg-secondary/20 text-base text-foreground"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground inline-flex"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="h-11 pl-10 pr-10 focus-visible:ring-primary border-border bg-secondary/20 text-base text-foreground"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold text-xs uppercase tracking-wider py-2.5 h-11 shadow-md shadow-primary/10 transition-all mt-2 flex items-center justify-center gap-1.5"
              >
                <span>Register</span>
                <ArrowRight size={14} className="text-white" />
              </Button>
            </form>
          </div>

          {/* Login redirect */}
          <div className="text-center text-xs text-muted-foreground">
            <span>Already have an account? </span>
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Log in
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}
