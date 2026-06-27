import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, User, ChevronDown, LogOut, X } from "lucide-react";
import Sidebar from "./Sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * MainLayout Component - Dark Theme
 * Houses the structural framework of the application, splitting the page
 * into a static left Sidebar and a scrollable right main-content area.
 * 
 * Props:
 * - children: content to render inside the main panel (React.ReactNode)
 * - currentTab: active sidebar navigation tab (string)
 * - setCurrentTab: callback to update active navigation tab (function)
 */
export default function MainLayout({ children, currentTab, setCurrentTab, notificationElement }) {
  const navigate = useNavigate();

  // Load user profile details from localStorage (or use default values)
  const [profile, setProfile] = useState(() => {
    try {
      const stored = localStorage.getItem("trackply_user_profile");
      return stored ? JSON.parse(stored) : {
        name: "John Doe",
        email: "john.doe@example.com",
        photo: "",
        mobile: "+1 (555) 019-2834"
      };
    } catch (e) {
      return {
        name: "John Doe",
        email: "john.doe@example.com",
        photo: "",
        mobile: "+1 (555) 019-2834"
      };
    }
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Profile Editor Form State
  const [editName, setEditName] = useState(profile.name);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [editMobile, setEditMobile] = useState(profile.mobile);
  const [editPhoto, setEditPhoto] = useState(profile.photo);

  const handleOpenEdit = () => {
    setEditName(profile.name);
    setEditEmail(profile.email);
    setEditMobile(profile.mobile);
    setEditPhoto(profile.photo);
    setIsEditModalOpen(true);
    setIsDropdownOpen(false);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1.5 * 1024 * 1024) {
        alert("Image size should be less than 1.5MB to save in local storage.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!editName.trim() || !editEmail.trim()) {
      alert("Name and email are required.");
      return;
    }
    const updated = {
      name: editName.trim(),
      email: editEmail.trim(),
      photo: editPhoto,
      mobile: editMobile.trim()
    };
    setProfile(updated);
    try {
      localStorage.setItem("trackply_user_profile", JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save profile to localStorage:", err);
      alert("Failed to save changes. Image details might be too large.");
    }
    setIsEditModalOpen(false);
  };

  return (
    <div className="flex w-full min-h-screen bg-background text-foreground">
      {/* Sidebar - fixed on the left */}
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Content Area - scrollable on the right */}
      <main className="flex-1 min-h-screen overflow-y-auto bg-background flex flex-col">
        {/* Top Header Bar for UI Polish */}
        <header className="h-14 border-b border-border px-8 flex items-center justify-between sticky top-0 bg-background/85 backdrop-blur-sm z-10 select-none">
          <div className="flex items-center gap-4">
            {/* History Navigation Arrows */}
            <div className="flex items-center gap-1 rounded-md border border-border p-0.5 bg-card/60">
              <button
                onClick={() => navigate(-1)}
                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-all inline-flex"
                title="Go Back"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => navigate(1)}
                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-all inline-flex"
                title="Go Forward"
              >
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Workspace</span>
              <span className="text-sm text-border">/</span>
              <span className="text-sm font-semibold text-foreground">Job Applications</span>
            </div>
          </div>
          
          {/* User Profile dropdown section */}
          <div className="flex items-center gap-4">
            {notificationElement}
            
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2.5 p-1 px-2 rounded-lg hover:bg-accent/40 border border-border/20 transition-all select-none cursor-pointer text-left focus:outline-none"
              >
                {/* Profile Photo / Icon */}
                {profile.photo ? (
                  <img
                    src={profile.photo}
                    alt={profile.name}
                    className="w-8 h-8 rounded-full object-cover border border-border"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                    <User size={15} />
                  </div>
                )}
                
                {/* User Info labels */}
                <div className="flex flex-col leading-tight select-none">
                  <span className="text-xs font-semibold text-foreground truncate max-w-[110px]">
                    {profile.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-medium truncate max-w-[110px]">
                    Local Mock Storage
                  </span>
                </div>
                <ChevronDown size={13} className={`text-muted-foreground/70 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Profile Dropdown Options */}
              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-44 bg-card border border-border rounded-lg shadow-xl py-1 z-50 animate-in fade-in duration-100">
                    <button
                      onClick={handleOpenEdit}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-foreground hover:bg-accent/50 flex items-center gap-2 transition-colors focus:outline-none"
                    >
                      <User size={13} className="text-muted-foreground" />
                      <span>Edit Details</span>
                    </button>
                    <div className="border-t border-border/60 my-1" />
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate("/login");
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 flex items-center gap-2 transition-colors focus:outline-none"
                    >
                      <LogOut size={13} />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Inner Content with generous padding */}
        <div className="flex-1 p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>

      {/* Edit Details Dialog Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent showCloseButton={false} className="sm:max-w-md p-5 border border-border bg-card shadow-2xl rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">Edit Profile Details</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Update your basic information and profile photo.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveProfile} className="space-y-4 mt-2">
            {/* Profile Photo selector */}
            <div className="flex flex-col items-center gap-3 bg-secondary/15 p-4 rounded-lg border border-border/40">
              <div className="relative group">
                {editPhoto ? (
                  <img src={editPhoto} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-primary" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <User size={24} />
                  </div>
                )}
                {editPhoto && (
                  <button
                    type="button"
                    onClick={() => setEditPhoto("")}
                    className="absolute -top-1 -right-1 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors shadow-md focus:outline-none"
                    title="Remove Photo"
                  >
                    <X size={10} />
                  </button>
                )}
              </div>
              
              <div className="flex flex-col items-center gap-1.5 w-full">
                <label className="cursor-pointer bg-secondary border border-border hover:bg-accent/40 text-foreground text-xs px-3 py-1.5 rounded transition-all font-semibold uppercase tracking-wider text-center w-fit select-none">
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
                <span className="text-[10px] text-muted-foreground/60">PNG, JPG up to 1.5MB</span>
              </div>

              <div className="w-full space-y-1">
                <Label htmlFor="photoUrl" className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Or Photo URL
                </Label>
                <Input
                  id="photoUrl"
                  type="text"
                  placeholder="https://example.com/avatar.jpg"
                  value={editPhoto && editPhoto.startsWith("data:") ? "" : editPhoto}
                  onChange={(e) => setEditPhoto(e.target.value)}
                  className="h-8 text-xs placeholder:text-muted-foreground/40 bg-card"
                />
              </div>
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="profileName" className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Full Name
              </Label>
              <Input
                id="profileName"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
                className="h-9 focus-visible:ring-primary text-xs bg-card"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="profileEmail" className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Email Address
              </Label>
              <Input
                id="profileEmail"
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                required
                className="h-9 focus-visible:ring-primary text-xs bg-card"
              />
            </div>

            {/* Mobile Number */}
            <div className="space-y-1.5">
              <Label htmlFor="profileMobile" className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Mobile Number
              </Label>
              <Input
                id="profileMobile"
                type="tel"
                value={editMobile}
                onChange={(e) => setEditMobile(e.target.value)}
                className="h-9 focus-visible:ring-primary text-xs bg-card"
                placeholder="+1 (555) 019-2834"
              />
            </div>

            <DialogFooter className="mt-4 flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                className="border-border text-foreground hover:bg-accent/40 font-semibold text-xs px-4"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-white font-semibold text-xs px-4"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
