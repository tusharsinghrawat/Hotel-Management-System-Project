import { Link } from "react-router-dom";
import { Users, Maximize, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const roomTypeLabels = {
  standard: "Standard",
  deluxe: "Deluxe",
  suite: "Suite",
  presidential: "Presidential",
};

export function RoomCard({ room }) {
  // ✅ UPGRADED IMAGE LOGIC (NO DOUBLE /rooms, NO BAD ENCODING)
  const getImageSrc = () => {
    if (!Array.isArray(room.image_urls) || room.image_urls.length === 0) {
      return "/placeholder.svg";
    }

    const raw = room.image_urls[0];

    if (!raw || typeof raw !== "string") {
      return "/placeholder.svg";
    }

    const clean = raw.trim();

    if (clean === "" || clean === "/rooms") {
      return "/placeholder.svg";
    }

    // Full URL (Cloudinary etc.)
    if (clean.startsWith("http")) {
      return clean;
    }

    // Already correct public path
    if (clean.startsWith("/rooms/")) {
      return clean;
    }

    // Only filename → prepend /rooms
    return `/rooms/${encodeURIComponent(clean)}`;
  };

  const imageSrc = getImageSrc();

  return (
    <div className="group bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={imageSrc}
          alt={room.name}
          loading="lazy"
          onError={(e) => {
            console.error("❌ Image failed:", imageSrc);
            e.currentTarget.src = "/placeholder.svg";
          }}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        <div className="absolute top-4 left-4">
          <Badge
            variant="secondary"
            className="bg-accent text-accent-foreground font-medium"
          >
            {roomTypeLabels[room.room_type]}
          </Badge>
        </div>

        {!room.is_available && (
          <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
            <span className="text-primary-foreground font-semibold text-lg">
              Unavailable
            </span>
          </div>
        )}
      </div>

      {/* Content (UNCHANGED) */}
      <div className="p-6">
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-accent text-accent" />
          ))}
        </div>

        <h3 className="text-xl font-serif font-semibold mb-2 group-hover:text-accent transition-colors">
          {room.name}
        </h3>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {room.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{room.capacity} Guests</span>
          </div>

          {room.size_sqft && (
            <div className="flex items-center gap-1">
              <Maximize className="h-4 w-4" />
              <span>{room.size_sqft} sqft</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <span className="text-2xl font-serif font-bold text-accent">
              ${room.price_per_night}
            </span>
            <span className="text-muted-foreground text-sm"> / night</span>
          </div>

          <Link to={`/rooms/${room._id}`}>
            <Button variant="gold" size="sm">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
