import PrintersAdminPage from "@/components/admin/printers/index";

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <PrintersAdminPage />
      </div>
    </main>
  );
}
