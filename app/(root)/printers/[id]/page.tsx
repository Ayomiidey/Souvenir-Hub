import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  MessageCircle,
  Printer as PrinterIcon,
  MapPin,
  Home,
} from "lucide-react";

async function getPrinter(id: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/printers/${id}`,
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
  const printer = await getPrinter((await params).id);
  if (!printer) return notFound();

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
          <div className="mb-6">
            <p className="text-base text-foreground font-medium">
              Contact this printer to discuss your print job, pricing, and
              delivery options.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {printer.phone && (
              <a
                href={`https://wa.me/${printer.phone.replace(/[^\d]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp Printer
                </Button>
              </a>
            )}
            {printer.email && (
              <a href={`mailto:${printer.email}`} className="w-full">
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  Email Printer
                </Button>
              </a>
            )}
            {printer.contact && (
              <div className="text-sm text-muted-foreground">
                <span className="font-semibold">Contact Person:</span>{" "}
                {printer.contact}
              </div>
            )}
            {printer.address && (
              <div className="text-sm text-muted-foreground">
                <span className="font-semibold">Address:</span>{" "}
                {printer.address}
              </div>
            )}
          </div>
          <Separator className="my-6" />
          <div className="flex justify-between items-center">
            <Link
              href="/"
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <Home className="h-4 w-4" /> Home
            </Link>
            <Link
              href="/products"
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              Back to Products
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
