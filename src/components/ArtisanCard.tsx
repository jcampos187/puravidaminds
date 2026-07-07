import Link from "next/link";
import Image from "next/image";
import CarretaWheel from "./CarretaWheel";

interface ArtisanCardProps {
  artisan: {
    id: string;
    name: string | null;
    avatarUrl: string | null;
    profile: {
      businessName: string | null;
      bio: string | null;
      location: string | null;
      coverImageUrl: string | null;
    } | null;
    productCount?: number;
  };
  itemsLabel?: string;
  fallbackName?: string;
}

export default function ArtisanCard({ artisan, itemsLabel, fallbackName = "Artisan" }: ArtisanCardProps) {
  return (
    <Link
      href={`/artisans/${artisan.id}`}
      className="carreta-card group block rounded-xl bg-white dark:bg-[#22223A]"
    >
      {/* Cover area */}
      <div className="relative h-32 overflow-hidden rounded-t-xl bg-gradient-to-br from-carreta-red/10 via-carreta-gold/10 to-carreta-blue/10">
        {artisan.profile?.coverImageUrl ? (            <Image
            src={artisan.profile.coverImageUrl}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center opacity-20">
            <CarretaWheel size={80} animated />
          </div>
        )}

        {/* Avatar */}
        <div className="absolute -bottom-10 left-5">
          <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-white shadow-lg dark:border-[#1A1A2E]">
            {artisan.avatarUrl ? (
              <Image
                src={artisan.avatarUrl}
                alt={artisan.name || fallbackName}
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-carreta-gold/20 text-2xl">
                🎨
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 pt-16">
        <h3 className="font-semibold text-[#1A1A2E] transition-colors group-hover:text-carreta-red dark:text-carreta-eggshell dark:group-hover:text-carreta-gold">
          {artisan.profile?.businessName || artisan.name || fallbackName}
        </h3>

        {artisan.profile?.location && (
          <p className="mt-1 text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
            📍 {artisan.profile.location}
          </p>
        )}

        {artisan.profile?.bio && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#1A1A2E]/70 dark:text-carreta-eggshell/70">
            {artisan.profile.bio}
          </p>
        )}

        {artisan.productCount !== undefined && (
          <p className="mt-3 inline-block rounded-full bg-carreta-blue/10 px-3 py-1 text-xs font-medium text-carreta-blue dark:bg-carreta-blue/20 dark:text-carreta-turquoise-light">
            {itemsLabel || `${artisan.productCount} ${artisan.productCount === 1 ? "artesanía" : "artesanías"}`}
          </p>
        )}
      </div>
    </Link>
  );
}
