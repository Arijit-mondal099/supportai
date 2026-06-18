import { redirect } from "next/navigation";
import { requireOwner } from "@/lib/auth";
import { AccountForm } from "@/components/dashboard/AccountForm";

export default async function AccountPage() {
  const owner = await requireOwner();
  if (!owner) redirect("/api/auth/login");

  return <AccountForm />;
}
