import StoreLayout from "@/components/store/StoreLayout";

export const metadata = {
  title: "Pokétrade",
  description: "Pokétrade",
};

export default function RootAdminLayout({ children }) {
  return (
    <>
      <StoreLayout>{children}</StoreLayout>
    </>
  );
}
