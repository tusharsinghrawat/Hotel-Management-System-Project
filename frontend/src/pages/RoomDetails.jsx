import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format, differenceInDays } from 'date-fns';
import { Users, Maximize, Check, Loader2, CalendarDays } from 'lucide-react';

import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { AvailabilityCalendar } from '@/components/rooms/AvailabilityCalendar';
import api from '@/lib/api';

const roomTypeLabels = {
  standard: 'Standard Room',
  deluxe: 'Deluxe Room',
  suite: 'Luxury Suite',
  presidential: 'Presidential Suite',
};

export default function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [checkIn, setCheckIn] = useState(undefined);
  const [checkOut, setCheckOut] = useState(undefined);
  const [guests, setGuests] = useState('1');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  // ✅ active image index
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  /* ================= FETCH ROOM ================= */
  const { data: room, isLoading, error } = useQuery({
    queryKey: ['room', id],
    queryFn: async () => {
      const res = await api.get(`/rooms/${id}`);
      return res.data;
    },
  });

  const nights =
    checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;

  const totalPrice = room ? nights * room.price_per_night : 0;

  const handleDateSelect = (newCheckIn, newCheckOut) => {
    setCheckIn(newCheckIn);
    setCheckOut(newCheckOut);
  };

  /* ================= BOOK ROOM ================= */
  // ================= BOOK ROOM =================
const handleBooking = async () => {
  if (!user) {
    toast({
      variant: 'destructive',
      title: 'Authentication required',
      description: 'Please sign in to book a room.',
    });
    navigate('/auth');
    return;
  }

  if (!checkIn || !checkOut || nights < 1) {
    toast({
      variant: 'destructive',
      title: 'Invalid dates',
      description: 'Please select valid check-in and check-out dates.',
    });
    return;
  }

  try {
    setIsBooking(true);

    // ✅ FIXED PAYLOAD (MATCHES BACKEND)
    await api.post('/bookings', {
      room: id,
      checkInDate: format(checkIn, 'yyyy-MM-dd'),
      checkOutDate: format(checkOut, 'yyyy-MM-dd'),
      guests: Number(guests),
      totalPrice: totalPrice,
      specialRequests: specialRequests || '',
    });

    queryClient.invalidateQueries({
      queryKey: ['room-bookings', id],
    });

    toast({
      title: 'Booking confirmed!',
      description: 'Your room has been booked successfully.',
    });

    navigate('/dashboard');
  } catch (err) {
    toast({
      variant: 'destructive',
      title: 'Booking failed',
      description:
        err.response?.data?.message || 'Something went wrong',
    });
  } finally {
    setIsBooking(false);
  }
};


  /* ================= LOADING ================= */
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen pt-32 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </Layout>
    );
  }

  /* ================= ERROR ================= */
  if (error || !room) {
    return (
      <Layout>
        <div className="min-h-screen pt-32 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-serif font-bold mb-4">
              Room Not Found
            </h1>
            <p className="text-muted-foreground mb-6">
              The room you're looking for doesn't exist.
            </p>
            <Button variant="gold" onClick={() => navigate('/rooms')}>
              View All Rooms
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  /* ================= JSX ================= */
  return (
    <Layout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* LEFT */}
            <div className="lg:col-span-2 space-y-8">
              {/* ===== IMAGES (FIXED) ===== */}
              <div>
                {/* MAIN IMAGE */}
                <div className="relative h-96 rounded-lg overflow-hidden mb-4">
                  <img
                    src={
                      room.image_urls?.[activeImageIndex] ||
                      '/placeholder.svg'
                    }
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* THUMBNAILS */}
                {room.image_urls?.length > 0 && (
                  <div className="grid grid-cols-5 gap-3">
                    {room.image_urls.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`${room.name}-${index}`}
                        onClick={() => setActiveImageIndex(index)}
                        className={`h-20 w-full object-cover rounded cursor-pointer border
                          ${
                            activeImageIndex === index
                              ? 'border-accent'
                              : 'border-transparent'
                          }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <p className="text-accent font-medium tracking-widest mb-2 uppercase">
                  {roomTypeLabels[room.room_type]}
                </p>
                <h1 className="text-4xl font-serif font-bold mb-4">
                  {room.name}
                </h1>

                <div className="flex flex-wrap gap-6 text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-accent" />
                    <span>Up to {room.capacity} Guests</span>
                  </div>

                  {room.size_sqft && (
                    <div className="flex items-center gap-2">
                      <Maximize className="h-5 w-5 text-accent" />
                      <span>{room.size_sqft} sq ft</span>
                    </div>
                  )}
                </div>

                <p className="text-foreground/80 leading-relaxed">
                  {room.description}
                </p>
              </div>

              {room.amenities?.length > 0 && (
                <div>
                  <h2 className="text-2xl font-serif font-bold mb-4">
                    Room Amenities
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {room.amenities.map((a) => (
                      <div key={a} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-accent" />
                        <span>{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-card rounded-lg shadow-md p-6 border">
                <div className="flex items-center gap-2 mb-6">
                  <CalendarDays className="h-6 w-6 text-accent" />
                  <h2 className="text-2xl font-serif font-bold">
                    Check Availability
                  </h2>
                </div>

                <AvailabilityCalendar
                  roomId={id}
                  onSelectDates={handleDateSelect}
                  selectedCheckIn={checkIn}
                  selectedCheckOut={checkOut}
                />
              </div>
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-card rounded-lg shadow-xl p-6 border">
                <div className="text-center mb-6">
                  <span className="text-3xl font-serif font-bold text-accent">
                    ${room.price_per_night}
                  </span>
                  <span className="text-muted-foreground"> / night</span>
                </div>

                <div className="space-y-4 mb-6">
                  <Select value={guests} onValueChange={setGuests}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(room.capacity)].map((_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>
                          {i + 1} Guest{i > 0 ? 's' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Textarea
                    placeholder="Any special requests..."
                    value={specialRequests}
                    onChange={(e) =>
                      setSpecialRequests(e.target.value)
                    }
                  />
                </div>

                {nights > 0 && (
                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between">
                      <span>
                        ${room.price_per_night} x {nights}
                      </span>
                      <span>${totalPrice}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-accent">
                        ${totalPrice}
                      </span>
                    </div>
                  </div>
                )}

                <Button
                  variant="gold"
                  size="lg"
                  className="w-full"
                  onClick={handleBooking}
                  disabled={!room.is_available || isBooking || nights < 1}
                >
                  {isBooking ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : nights > 0 ? (
                    'Confirm Booking'
                  ) : (
                    'Select Dates'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
