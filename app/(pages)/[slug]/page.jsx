import ProfessionalProfile from "@/components/pages/professionalProfile";
import { notFound } from "next/navigation";
import { headers } from "next/headers";

export default async function ProfessionalPage({ params }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  if (!decodedSlug.startsWith("@")) {
    notFound();
  }

  const username = decodedSlug.substring(1);

  const headersList = headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const baseUrl = `${protocol}://${host}`;

  const professional = await fetch(
    `${baseUrl}/api/v1/professionals/profile/${username}`,
    { cache: "no-store" },
  );

  if (!professional.ok) {
    notFound();
  }

  const professionalProfile = await professional.json();

  return <ProfessionalProfile professional={professionalProfile} />;
}
