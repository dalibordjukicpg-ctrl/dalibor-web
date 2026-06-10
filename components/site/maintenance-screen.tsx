import { SiteLogo } from "@/components/site/site-logo";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  message: string;
  className?: string;
};

/**
 * Puna zamjena za `[locale]` layout kad je uključen maintenance u CMS-u.
 */
export function MaintenanceScreen({ title, message, className }: Props) {
  return (
    <div
      className={cn(
        "flex min-h-dvh flex-col items-center justify-center px-6 py-16 text-center",
        className,
      )}
      style={{
        background:
          "linear-gradient(165deg, #fff9f5 0%, #fdf5ee 45%, #f5ebe3 100%)",
      }}
    >
      <div className="mx-auto flex max-w-lg flex-col items-center gap-8">
        <SiteLogo
          variant="footer"
          className="sm:h-20 sm:max-w-[min(100%,360px)]"
        />
        <div className="space-y-4">
          <h1
            className="text-2xl font-semibold leading-tight text-[#1a1208] sm:text-3xl"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            {title}
          </h1>
          <p className="whitespace-pre-wrap text-base leading-relaxed text-[#4a3f36]">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
