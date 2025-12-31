import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal } from "lucide-react";

import { Layout } from "@/components/layout/Layout";
import { RoomCard } from "@/components/rooms/RoomCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import api from "@/lib/api";
import { localRooms } from "@/data/rooms.local"; // 🇮🇳 Frontend fallback rooms data

export default function Rooms() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roomTypeFilter, setRoomTypeFilter] = useState("all");
  const [priceSort, setPriceSort] = useState("default");

  const {
    data: rooms = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      try {
        // 🇮🇳 Fetch rooms from backend (prices are in INR per night)
        const res = await api.get("/rooms");

        return res.data.map((room) => {
          let images = [];

          if (Array.isArray(room.image_urls) && room.image_urls.length > 0) {
            images = room.image_urls;
          } else if (room.image) {
            images = [room.image];
          }

          const normalizedImages = images
            .map((img) =>
              typeof img === "string" ? img.split("/").pop() : null
            )
            .filter(Boolean);

          return {
            ...room,
            image_urls:
              normalizedImages.length > 0
                ? normalizedImages
                : ["placeholder.svg"],
          };
        });
      } catch (err) {
        // 🇮🇳 Backend unavailable → use local Indian demo room data
        console.warn("Backend not available, using frontend rooms data");

        return localRooms.map((room) => ({
          ...room,
          image_urls: [room.image || "placeholder.svg"],
        }));
      }
    },
  });

  const filteredRooms = useMemo(() => {
    return rooms
      .filter((room) => {
        const matchesSearch =
          room.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          room.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase());

        const matchesType =
          roomTypeFilter === "all" ||
          room.room_type?.toLowerCase() === roomTypeFilter;

        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        // 🇮🇳 Sorting by room price (INR per night)
        if (priceSort === "low-high")
          return a.price_per_night - b.price_per_night;
        if (priceSort === "high-low")
          return b.price_per_night - a.price_per_night;
        return 0;
      });
  }, [rooms, searchQuery, roomTypeFilter, priceSort]);

  return (
    <Layout>
      {/* 🇮🇳 Header section for room listings */}
      <section className="pt-32 pb-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <p className="text-accent font-medium tracking-widest mb-2 uppercase">
            Accommodations
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Our Rooms & Suites
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Discover our collection of beautifully appointed rooms and suites,
            each designed to provide comfort and luxury for Indian travellers.
          </p>
        </div>
      </section>

      {/* 🇮🇳 Filters: search, room type, price (INR) */}
      <section className="py-8 bg-secondary border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search rooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <Select value={roomTypeFilter} onValueChange={setRoomTypeFilter}>
                <SelectTrigger className="w-40">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Room Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="deluxe">Deluxe</SelectItem>
                  <SelectItem value="suite">Suite</SelectItem>
                  <SelectItem value="presidential">Presidential</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priceSort} onValueChange={setPriceSort}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="low-high">
                    Price: Low to High
                  </SelectItem>
                  <SelectItem value="high-low">
                    Price: High to Low
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* 🇮🇳 Rooms grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-card rounded-lg overflow-hidden shadow-md animate-pulse"
                >
                  <div className="h-64 bg-muted" />
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="h-10 bg-muted rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive text-lg">
                Error loading rooms.
              </p>
            </div>
          ) : filteredRooms.length > 0 ? (
            <>
              <p className="text-muted-foreground mb-8">
                Showing {filteredRooms.length} room
                {filteredRooms.length !== 1 ? "s" : ""}
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredRooms.map((room) => (
                  <RoomCard key={room._id} room={room} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-card rounded-lg">
              <p className="text-muted-foreground text-lg">
                No rooms found matching your criteria.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setRoomTypeFilter("all");
                  setPriceSort("default");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
