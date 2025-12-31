import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import api from "@/lib/api"; // ✅ API integration

/* -------------------- Validation -------------------- */
/* 🇮🇳 Same validation rules – suitable for Indian contact forms */

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email').max(255),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
});

/* -------------------- Contact Info -------------------- */
/* 🇮🇳 Indian-standard address, phone & timings */

const contactInfo = [
  {
    icon: MapPin,
    title: 'Address',
    details: [
      'Grand Hotel',
      'MG Road, Near City Center',
      'Jaipur, Rajasthan – 302001, India',
    ],
  },
  {
    icon: Phone,
    title: 'Phone',
    details: ['+91 98765 43210', '+91 91234 56789'],
  },
  {
    icon: Mail,
    title: 'Email',
    details: ['info@grandhotel.in', 'reservations@grandhotel.in'],
  },
  {
    icon: Clock,
    title: 'Front Desk Hours',
    details: [
      '24 Hours / 7 Days',
      'Check-in: 12:00 PM',
      'Check-out: 11:00 AM',
    ],
  },
];

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  /* -------------------- Submit -------------------- */
  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // 🇮🇳 Save customer enquiry
      await api.post("/contact", {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      });

      toast({
        title: "Message sent successfully!",
        description: "Our team will contact you shortly.",
      });

      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to send message",
        description:
          error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* 🇮🇳 Header */}
      <section className="pt-32 pb-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <p className="text-accent font-medium tracking-widest mb-2 uppercase">
            Get in Touch
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Contact Us
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Have a question or need assistance? Reach out to us for bookings,
            enquiries, or support.
          </p>
        </div>
      </section>

      {/* 🇮🇳 Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-serif font-bold mb-8">
                Contact Information
              </h2>
              <div className="space-y-8">
                {contactInfo.map((info) => (
                  <div key={info.title} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                      <info.icon className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{info.title}</h3>
                      {info.details.map((detail, i) => (
                        <p
                          key={i}
                          className="text-muted-foreground text-sm"
                        >
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg shadow-xl p-8">
                <h2 className="text-2xl font-serif font-bold mb-6">
                  Send Us a Message
                </h2>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-6"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        placeholder="Rahul Sharma"
                        {...form.register('name')}
                      />
                      {form.formState.errors.name && (
                        <p className="text-destructive text-sm">
                          {form.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="rahul@example.com"
                        {...form.register('email')}
                      />
                      {form.formState.errors.email && (
                        <p className="text-destructive text-sm">
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Room booking enquiry"
                      {...form.register('subject')}
                    />
                    {form.formState.errors.subject && (
                      <p className="text-destructive text-sm">
                        {form.formState.errors.subject.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Please share your requirements or questions..."
                      rows={5}
                      {...form.register('message')}
                    />
                    {form.formState.errors.message && (
                      <p className="text-destructive text-sm">
                        {form.formState.errors.message.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="gold"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🇮🇳 Map Section (Location reference) */}
      <section className="h-96 bg-muted">
        <iframe
          src="https://www.google.com/maps"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Hotel Location"
        />
      </section>
    </Layout>
  );
}
