import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Feature } from "@/components/Feature";
import { Platform } from "@/components/Platform";
import { UseCases } from "@/components/UseCases";
import { Resources } from "@/components/Resources";
import { Pricing } from "@/components/Pricing";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { getUserSession } from "@/lib/getUserSession";

const HomePage = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (token) {
    redirect("/dashboard");
  }

  const session = await getUserSession();

  return (
    <div className="relative min-h-screen bg-pinstripe text-zinc-900 overflow-x-clip">
      <Navbar email={session?.user?.email ? session?.user?.email : null} />
      <div className="mx-auto w-full max-w-[1600px] border-x border-zinc-500/50">
        <Hero email={session?.user?.email ? session?.user?.email : null} />
        <Feature />
        <Platform />
        <UseCases />
        <Resources />
        <Pricing />
        <Faq />
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
