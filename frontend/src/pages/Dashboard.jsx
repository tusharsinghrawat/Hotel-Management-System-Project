import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar, MapPin, Clock, Loader2 } from "lucide-react";

import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
};

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["user-bookings"],
    queryFn: async () => {
      const { data } = await api.get("/bookings/my");
      return data;
    },
    enabled: !!user,
  });

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen pt-32 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-32 pb-16 min-h-screen bg-secondary">
        <div className="container mx-auto px-4">

          {/* Welcome */}
          <div className="mb-12">
            <h1 className="text-4xl font-serif font-bold mb-2">
              Welcome, {user?.name || "Guest"}
            </h1>
            <p className="text-muted-foreground">
              Manage your bookings and account details
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <StatCard
              icon={<Calendar className="h-6 w-6 text-accent" />}
              label="Total Bookings"
              value={bookings.length}
            />
            <StatCard
              icon={<Clock className="h-6 w-6 text-green-600" />}
              label="Active Bookings"
              value={bookings.filter(b => b.status === "confirmed").length}
            />
            <StatCard
              icon={<MapPin className="h-6 w-6 text-blue-600" />}
              label="Completed Stays"
              value={bookings.filter(b => b.status === "completed").length}
            />
          </div>

          {/* Booking List */}
          <h2 className="text-2xl font-serif font-bold mb-6">Your Bookings</h2>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-card rounded-lg shadow-md p-6 flex flex-col md:flex-row gap-6"
                >
                  <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden">
                    <img
                      src={booking.room?.image || "/placeholder.svg"}
                      alt={booking.room?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <h3 className="text-xl font-serif font-semibold">
                        {booking.room?.name}
                      </h3>
                      <Badge className={statusColors[booking.status]}>
                        {booking.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Check-in</p>
                        <p>{format(new Date(booking.checkIn), "PP")}</p>
                      </div>
                      <div>
                        <p className="font-medium">Check-out</p>
                        <p>{format(new Date(booking.checkOut), "PP")}</p>
                      </div>
                      <div>
                        <p className="font-medium">Guests</p>
                        <p>{booking.guests}</p>
                      </div>
                      <div>
                        <p className="font-medium">Total</p>
                        <p className="text-accent font-bold">
                          ₹{booking.totalPrice}
                        </p>
                      </div>
                    </div>

                    {booking.specialRequests && (
                      <p className="text-sm mt-2 text-muted-foreground">
                        <b>Special Requests:</b> {booking.specialRequests}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-lg">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Bookings Yet</h3>
              <Button variant="gold" onClick={() => navigate("/rooms")}>
                Browse Rooms
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

/* Small reusable stat card */
function StatCard({ icon, label, value }) {
  return (
    <div className="bg-card rounded-lg shadow-md p-6 flex items-center gap-4">
      <div className="p-3 bg-muted rounded-full">{icon}</div>
      <div>
        <p className="text-muted-foreground text-sm">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
