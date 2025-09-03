import ProfessionalProfile from "@/components/pages/professionalProfile";

export default async function ProfessionalPage({ params }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const username = decodedSlug.substring(1);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const professional = await fetch(
    `${baseUrl}/api/v1/professionals/profile/${username}`,
  );

  const professionalProfile = await professional.json();

  return <ProfessionalProfile professional={professionalProfile} />;
}
