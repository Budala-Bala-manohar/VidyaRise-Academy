export async function GET() {
  return Response.json([
    {
      id: 1,
      title: "Coding",
      description: "Learn programming fundamentals, data structures, and web development.",
      duration: "8 weeks",
      mode: "Online"
    },
    {
      id: 2,
      title: "Aptitude",
      description: "Develop logical reasoning and problem-solving skills.",
      duration: "4 weeks",
      mode: "Hybrid"
    },
    {
      id: 3,
      title: "AI Awareness",
      description: "Introduction to AI, ML, and future technologies.",
      duration: "12 weeks",
      mode: "Online"
    },
    {
      id: 4,
      title: "Soft Skills",
      description: "Communication, teamwork, and leadership skills.",
      duration: "6 weeks",
      mode: "Offline"
    }
  ]);
}
