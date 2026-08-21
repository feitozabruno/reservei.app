import { notFound } from "next/navigation";
import { ProfessionalProfile } from "./ProfessionalProfile";

export default async function ProfessionalPage({ params }) {
  const { username } = await params;
  const decodedSlug = decodeURIComponent(username);

  if (!decodedSlug.startsWith("@")) {
    notFound();
  }

  const slug = decodedSlug.substring(1);

  const professional = await fetch(
    `http://localhost:5000/api/professionals/${slug}`,
    { cache: "no-store" },
  );

  if (!professional.ok) {
    notFound();
  }

  const professionalProfile = await professional.json();

  return (
    <div className="m-auto flex w-full max-w-md flex-col gap-6">
      <ProfessionalProfile Professional={professionalProfile} />
    </div>
  );
}
