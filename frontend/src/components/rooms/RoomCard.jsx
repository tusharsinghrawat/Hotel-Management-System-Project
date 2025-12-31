import { Link } from "react-router-dom";
import { Users, Maximize, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/* 🇮🇳 Room type labels (unchanged) */
const roomTypeLabels = {
  standard: "Standard",
  deluxe: "Deluxe",
  suite: "Suite",
  presidential: "Presidential",
};

/* 🇮🇳 Indian standard room rates (frontend controlled) */
const ROOM_RATES = {
  standard: 2999,
  deluxe: 4999,
  suite: 7999,
  presidential: 12999,
};

export function RoomCard({ room }) {
  const BASE = import.meta.env.BASE_URL;

  // ✅ FINAL, BULLETPROOF IMAGE LOGIC
  const getImageSrc = () => {
    if (!room.image || typeof room.image !== "string") {
      return `${BASE}rooms/placeholder.svg`;
    }

    let clean = room.image.trim();

    // 🔥 NORMALIZE IMAGE NAME
    // room3.jpg / room03.jpg → room-3.jpg
    clean = clean.replace(/^room0*(\d+)/i, "room-$1");

    // external image (cloudinary etc.)
    if (clean.startsWith("http")) {
      return clean;
    }

    return `${BASE}rooms/${clean}`;
  };

  const imageSrc = getImageSrc();

  /* 🇮🇳 Decide rate by room type (ignore backend price) */
  const roomRate = ROOM_RATES[room.room_type] || 0;

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
            e.currentTarget.src = `${BASE}rooms/placeholder.svg`;
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
              ₹{roomRate}
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
