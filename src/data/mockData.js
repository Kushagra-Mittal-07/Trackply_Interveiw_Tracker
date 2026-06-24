/**
 * Mock data for Trackply (Phase 1)
 * Contains exactly 8 sample applications covering all 6 statuses:
 * - Applied, Screening, OA (Online Assessment), Interview, Offer, Rejected
 * 
 * Each application contains:
 * - id: unique identifier (string)
 * - company: name of the company (string)
 * - role: title of the position (string)
 * - status: current application stage (string)
 * - deadline: target deadline date in YYYY-MM-DD format (string)
 * - dateApplied: date applied in YYYY-MM-DD format (string)
 * - url: job posting URL (string)
 * - notes: miscellaneous details (string)
 */

export const initialApplications = [
  {
    id: "1",
    company: "Stripe",
    role: "Frontend Engineer Intern",
    status: "Offer",
    deadline: "2026-07-15",
    dateApplied: "2026-06-10",
    url: "https://stripe.com/careers/",
    notes: "Completed final round behavioral. Recruiter reached out with verbal offer!"
  },
  {
    id: "2",
    company: "Google",
    role: "Software Engineering Intern",
    status: "OA",
    deadline: "2026-06-28",
    dateApplied: "2026-06-15",
    url: "https://careers.google.com/",
    notes: "Received snapshot OA. Need to complete within 7 days. Focus on graphs and DP."
  },
  {
    id: "3",
    company: "Figma",
    role: "Product Engineering Intern",
    status: "Interview",
    deadline: "2026-06-25",
    dateApplied: "2026-06-12",
    url: "https://figma.com/careers/",
    notes: "Technical interview scheduled with Senior Engineer. System design basics and React principles."
  },
  {
    id: "4",
    company: "Notion",
    role: "Full Stack Developer Intern",
    status: "Screening",
    deadline: "2026-07-05",
    dateApplied: "2026-06-18",
    url: "https://notion.so/careers/",
    notes: "Recruiter phone screening scheduled next Tuesday at 2 PM. Review resume projects."
  },
  {
    id: "5",
    company: "Vercel",
    role: "Developer Relations Intern",
    status: "Applied",
    deadline: "2026-07-20",
    dateApplied: "2026-06-22",
    url: "https://vercel.com/careers/",
    notes: "Applied via internal referral. Included link to personal portfolio."
  },
  {
    id: "6",
    company: "Meta",
    role: "Software Engineer Intern",
    status: "Rejected",
    deadline: "2026-06-20",
    dateApplied: "2026-06-01",
    url: "https://meta.com/careers/",
    notes: "Resume screen reject. Will try again next recruiting cycle with stronger systems experience."
  },
  {
    id: "7",
    company: "Airbnb",
    role: "Frontend Engineer Intern",
    status: "Interview",
    deadline: "2026-06-30",
    dateApplied: "2026-06-08",
    url: "https://airbnb.com/careers/",
    notes: "Completed initial technical screen. Moving to virtual onsite with two technical coding sessions."
  },
  {
    id: "8",
    company: "Slack",
    role: "Software Engineer",
    status: "Applied",
    deadline: "2026-07-10",
    dateApplied: "2026-06-19",
    url: "https://slack.com/careers/",
    notes: "Applied online through company website. No response yet."
  }
];
