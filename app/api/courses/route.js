export async function GET() {
  return Response.json([
    { id: 1, title: "Coding", description: "Learn programming" },
    { id: 2, title: "Aptitude", description: "Problem solving skills" },
    { id: 3, title: "Soft Skills", description: "Communication skills" },
    { id: 4, title: "AI", description: "Artificial Intelligence basics" }
  ]);
}
{courses.map((course) => (
  <div key={course.id}>
    <h2>{course.title}</h2>
    <p>{course.description}</p>
  </div>
))}
