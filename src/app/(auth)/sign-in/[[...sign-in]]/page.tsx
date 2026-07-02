import { SignIn } from "@clerk/nextjs";
import CarretaWheel from "@/components/CarretaWheel";
import { getTranslations } from "@/i18n/getTranslations";

export default async function SignInPage() {
  const { t } = await getTranslations();

  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-gradient-to-b from-carreta-cream via-white to-carreta-cream px-6 py-24 dark:from-[#1A1A2E] dark:via-[#22223A] dark:to-[#1A1A2E]">
      <div className="absolute inset-0 overflow-hidden opacity-[0.03]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='50' fill='none' stroke='%23CC2936' stroke-width='3'/%3E%3Cline x1='60' y1='12' x2='60' y2='108' stroke='%23005ABB' stroke-width='2'/%3E%3Cline x1='12' y1='60' x2='108' y2='60' stroke='%23005ABB' stroke-width='2'/%3E%3C/svg%3E")`,
            backgroundSize: "120px 120px",
          }}
        />
      </div>
      <div className="relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <CarretaWheel size={48} variant="outline" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1A1A2E] dark:text-carreta-eggshell">
            {t("auth.signIn.title")}
          </h1>
          <p className="mt-2 text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
            {t("auth.signIn.sub")}
          </p>
        </div>
        <SignIn />
      </div>
    </div>
  );
}
