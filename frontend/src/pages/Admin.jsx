import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Loader2, Hotel, Calendar } from "lucide-react";

import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api"; // ✅ FIXED (default import)

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
};

export default function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const [roomForm, setRoomForm] = useState({
    name: "",
    description: "",
    room_type: "standard",
    price_per_night: "",
    capacity: "2",
    size_sqft: "",
    amenities: "",
    image_url: "",
    is_available: true,
  });

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You don't have permission to access this page.",
      });
      navigate("/");
    }
  }, [user, isAdmin, loading, navigate, toast]);

  // ================= ROOMS =================
  const { data: rooms = [], isLoading: roomsLoading } = useQuery({
    queryKey: ["admin-rooms"],
    queryFn: async () => {
      const { data } = await api.get("/rooms/admin");
      return data;
    },
    enabled: isAdmin,
  });

  // ================= BOOKINGS =================
  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      const { data } = await api.get("/bookings");
      return data;
    },
    enabled: isAdmin,
  });

  // ================= CREATE / UPDATE ROOM =================
  const roomMutation = useMutation({
    mutationFn: async (room) => {
      if (editingRoom) {
        await api.put(`/rooms/${editingRoom._id}`, room);
      } else {
        await api.post("/rooms", room);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-rooms"] });
      toast({ title: editingRoom ? "Room updated" : "Room created" });
      setIsRoomDialogOpen(false);
      resetRoomForm();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  // ================= DELETE ROOM =================
  const deleteRoomMutation = useMutation({
    mutationFn: async (roomId) => {
      await api.delete(`/rooms/${roomId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-rooms"] });
      toast({ title: "Room deleted" });
    },
  });

  // ================= UPDATE BOOKING STATUS =================
  const updateBookingMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      await api.patch(`/bookings/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      toast({ title: "Booking updated" });
    },
  });

  const resetRoomForm = () => {
    setRoomForm({
      name: "",
      description: "",
      room_type: "standard",
      price_per_night: "",
      capacity: "2",
      size_sqft: "",
      amenities: "",
      image_url: "",
      is_available: true,
    });
    setEditingRoom(null);
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setRoomForm({
      name: room.name,
      description: room.description || "",
      room_type: room.room_type,
      price_per_night: String(room.price_per_night),
      capacity: String(room.capacity),
      size_sqft: room.size_sqft ? String(room.size_sqft) : "",
      amenities: room.amenities?.join(", ") || "",
      image_url: room.image_url || "",
      is_available: room.is_available,
    });
    setIsRoomDialogOpen(true);
  };

  const handleSubmitRoom = () => {
    const roomData = {
      name: roomForm.name,
      description: roomForm.description || null,
      room_type: roomForm.room_type,
      price_per_night: Number(roomForm.price_per_night),
      capacity: Number(roomForm.capacity),
      size_sqft: roomForm.size_sqft ? Number(roomForm.size_sqft) : null,
      amenities: roomForm.amenities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
      image_url: roomForm.image_url || null,
      is_available: roomForm.is_available,
    };
    roomMutation.mutate(roomData);
  };

  if (loading || !isAdmin) {
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
          <h1 className="text-4xl font-serif font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground mb-8">
            Manage rooms and bookings
          </p>

          {/* ⬇️ JSX CONTENT SAME AS BEFORE ⬇️ */}
        </div>
      </div>
    </Layout>
  );
}
