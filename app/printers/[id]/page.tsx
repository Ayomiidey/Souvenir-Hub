import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Printer as PrinterIcon,
  MapPin,
  Mail,
  MessageSquare,
} from "lucide-react";

async function getPrinter(id: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/printers/${id}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function PrinterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const printer = await getPrinter(id);
  if (!printer) return notFound();

  const whatsappLink = printer.phone
    ? `https://wa.me/${printer.phone.replace(/[^\d]/g, "")}`
    : null;
  const emailLink = printer.email ? `mailto:${printer.email}` : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col items-center py-10 px-4">
      <Card className="w-full max-w-xl shadow-lg border-0">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <PrinterIcon className="h-7 w-7 text-orange-600" />
            <h1 className="text-2xl font-bold text-foreground">
              {printer.name}
            </h1>
            <Badge className="ml-auto bg-orange-100 text-orange-800">
              Printer
            </Badge>
          </div>
          <Separator className="mb-4" />
          <div className="mb-3 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-muted-foreground">
              {printer.location?.name}, {printer.state?.name}
            </span>
          </div>
          {printer.description && (
            <div className="mb-4">
              <p className="text-base text-muted-foreground">
                {printer.description}
              </p>
            </div>
          )}
          <div className="flex gap-3 mt-6">
            {whatsappLink && (
              <Button
                asChild
                variant="outline"
                className="flex items-center gap-2"
              >
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageSquare className="h-5 w-5 text-green-600" /> WhatsApp
                </a>
              </Button>
            )}
            {emailLink && (
              <Button
                asChild
                variant="outline"
                className="flex items-center gap-2"
              >
                <a href={emailLink} target="_blank" rel="noopener noreferrer">
                  <Mail className="h-5 w-5 text-blue-600" /> Email
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
