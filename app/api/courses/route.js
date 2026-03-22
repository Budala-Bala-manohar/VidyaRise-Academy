export async function GET() {
  return Response.json([
    { id: 1, title: "Coding" },
    { id: 2, title: "Aptitude" },
    { id: 3, title: "AI Awareness" },
    { id: 4, title: "Soft Skills" }
  ]);
}
