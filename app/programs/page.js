export default function ProgramsPage() {
  const courses = [
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
  ];

  return (
    <div style={{ padding: "40px" }}>
      <h1>Comprehensive Learning Programs</h1>

      <div style={{ display: "grid", gap: "20px", marginTop: "20px" }}>
        {courses.map((course) => (
          <div key={course.id} style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "10px" }}>
            <h2>{course.title}</h2>
            <p>{course.description}</p>
            <p>{course.duration} • {course.mode}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
