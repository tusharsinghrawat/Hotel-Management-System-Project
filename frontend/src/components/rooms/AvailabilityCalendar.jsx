import { useQuery } from "@tanstack/react-query";
import {
  format,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function AvailabilityCalendar({
  roomId,
  onSelectDates,
  selectedCheckIn,
  selectedCheckOut,
}) {
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["room-bookings", roomId],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/room/${roomId}`
      );

      if (!res.ok) {
        throw new Error("Failed to load bookings");
      }

      return res.json();
    },
    enabled: !!roomId,
  });

  // Convert bookings to booked dates
  const bookedDates = bookings.flatMap((booking) => {
    const start = new Date(booking.check_in);
    const end = new Date(booking.check_out);
    return eachDayOfInterval({ start, end });
  });

  const isDateBooked = (date) =>
    bookedDates.some((d) => isSameDay(d, date));

  const handleSelect = (date) => {
    if (!date || !onSelectDates) return;

    if (!selectedCheckIn || selectedCheckOut) {
      onSelectDates(date, undefined);
      return;
    }

    if (date <= selectedCheckIn) {
      onSelectDates(date, undefined);
      return;
    }

    const range = eachDayOfInterval({
      start: selectedCheckIn,
      end: date,
    });

    const hasBooked = range.some(isDateBooked);

    if (hasBooked) {
      onSelectDates(date, undefined);
    } else {
      onSelectDates(selectedCheckIn, date);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <Legend color="bg-destructive/20 border-destructive/40" label="Booked" />
        <Legend color="bg-accent" label="Selected" />
        <Legend color="bg-card border-border" label="Available" />
      </div>

      <Calendar
        mode="single"
        selected={selectedCheckIn}
        onSelect={handleSelect}
        disabled={(date) =>
          date < new Date() || isDateBooked(date)
        }
        numberOfMonths={2}
        className="rounded-lg border border-border p-4"
        classNames={{
          months: "flex flex-col md:flex-row gap-4",
          day_disabled:
            "text-muted-foreground opacity-50 line-through",
        }}
        modifiers={{
          booked: bookedDates,
          rangeStart: selectedCheckIn ? [selectedCheckIn] : [],
          rangeEnd: selectedCheckOut ? [selectedCheckOut] : [],
          inRange:
            selectedCheckIn && selectedCheckOut
              ? eachDayOfInterval({
                  start: selectedCheckIn,
                  end: selectedCheckOut,
                })
              : [],
        }}
        modifiersClassNames={{
          booked:
            "bg-destructive/20 text-destructive line-through cursor-not-allowed",
          rangeStart:
            "bg-accent text-accent-foreground rounded-l-md",
          rangeEnd:
            "bg-accent text-accent-foreground rounded-r-md",
          inRange: "bg-accent/30",
        }}
      />

      {selectedCheckIn && (
        <div className="text-sm text-muted-foreground">
          {selectedCheckOut ? (
            <p>
              Selected:{" "}
              <span className="font-medium text-foreground">
                {format(selectedCheckIn, "PPP")}
              </span>
              {" → "}
              <span className="font-medium text-foreground">
                {format(selectedCheckOut, "PPP")}
              </span>
            </p>
          ) : (
            <p>
              Check-in:{" "}
              <span className="font-medium text-foreground">
                {format(selectedCheckIn, "PPP")}
              </span>
              <span className="text-accent">
                {" "}
                — Select check-out date
              </span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-4 h-4 rounded border", color)} />
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}
