import { I18nProvider } from "@/i18n";
import { Sidebar } from "@/components/Sidebar";
import GoogleProvider from "@/components/GoogleProvider";
import "./../globals.css";

const jakarta = {
  variable: "--font-jakarta",
};

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <I18nProvider>
      <html lang="th">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="bg-surface font-body-md text-body-md text-on-surface antialiased">
          <GoogleProvider>
            <Sidebar />
            <main className="pb-20 md:pb-0 md:pt-16">
              {children}
            </main>
          </GoogleProvider>
        </body>
      </html>
    </I18nProvider>
  );
}