import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
  title: "PokéTrade - Admin",
  description: "PokéTrade - Admin",
};

export default function RootAdminLayout({ children }) {
  return (
    <>
      <AdminLayout>{children}</AdminLayout>
    </>
  );
}
