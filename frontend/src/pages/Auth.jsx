// import { useState, useEffect } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";

// import { Layout } from "@/components/layout/Layout";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useAuth } from "@/hooks/useAuth";
// import { Loader2 } from "lucide-react";

// /* -------------------- Zod Schemas -------------------- */

// const signInSchema = z.object({
//   email: z.string().email("Please enter a valid email address"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
// });

// const signUpSchema = z
//   .object({
//     fullName: z.string().min(2, "Name must be at least 2 characters"),
//     email: z.string().email("Please enter a valid email address"),
//     password: z.string().min(6, "Password must be at least 6 characters"),
//     confirmPassword: z.string(),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords don't match",
//     path: ["confirmPassword"],
//   });

// /* -------------------- Component -------------------- */

// export default function Auth() {
//   const [searchParams] = useSearchParams();
//   const [isSignUp, setIsSignUp] = useState(searchParams.get("mode") === "signup");
//   const [isLoading, setIsLoading] = useState(false);

//   const { user, signIn, signUp } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (user) {
//       navigate("/dashboard");
//     }
//   }, [user, navigate]);

//   const signInForm = useForm({
//     resolver: zodResolver(signInSchema),
//     defaultValues: { email: "", password: "" },
//   });

//   const signUpForm = useForm({
//     resolver: zodResolver(signUpSchema),
//     defaultValues: {
//       fullName: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//     },
//   });

//   const handleSignIn = async (data) => {
//     setIsLoading(true);
//     const { error } = await signIn(data.email, data.password);
//     setIsLoading(false);

//     if (!error) {
//       navigate("/dashboard");
//     }
//   };

//   const handleSignUp = async (data) => {
//     setIsLoading(true);
//     const { error } = await signUp(data.email, data.password, data.fullName);
//     setIsLoading(false);

//     if (!error) {
//       navigate("/dashboard");
//     }
//   };

//   return (
//     <Layout>
//       <div className="min-h-screen pt-32 pb-20 px-4 bg-secondary">
//         <div className="max-w-md mx-auto">
//           <div className="bg-card rounded-lg shadow-xl p-8">
//             <div className="text-center mb-8">
//               <h1 className="text-3xl font-serif font-bold mb-2">
//                 {isSignUp ? "Create Account" : "Welcome Back"}
//               </h1>
//               <p className="text-muted-foreground">
//                 {isSignUp
//                   ? "Join us for an unforgettable experience"
//                   : "Sign in to manage your bookings"}
//               </p>
//             </div>

//             {isSignUp ? (
//               <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="fullName">Full Name</Label>
//                   <Input
//                     id="fullName"
//                     placeholder="John Doe"
//                     {...signUpForm.register("fullName")}
//                   />
//                   {signUpForm.formState.errors.fullName && (
//                     <p className="text-destructive text-sm">
//                       {signUpForm.formState.errors.fullName.message}
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="email">Email</Label>
//                   <Input
//                     id="email"
//                     type="email"
//                     placeholder="john@example.com"
//                     {...signUpForm.register("email")}
//                   />
//                   {signUpForm.formState.errors.email && (
//                     <p className="text-destructive text-sm">
//                       {signUpForm.formState.errors.email.message}
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="password">Password</Label>
//                   <Input
//                     id="password"
//                     type="password"
//                     placeholder="••••••••"
//                     {...signUpForm.register("password")}
//                   />
//                   {signUpForm.formState.errors.password && (
//                     <p className="text-destructive text-sm">
//                       {signUpForm.formState.errors.password.message}
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="confirmPassword">Confirm Password</Label>
//                   <Input
//                     id="confirmPassword"
//                     type="password"
//                     placeholder="••••••••"
//                     {...signUpForm.register("confirmPassword")}
//                   />
//                   {signUpForm.formState.errors.confirmPassword && (
//                     <p className="text-destructive text-sm">
//                       {signUpForm.formState.errors.confirmPassword.message}
//                     </p>
//                   )}
//                 </div>

//                 <Button type="submit" variant="gold" className="w-full" disabled={isLoading}>
//                   {isLoading ? (
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                   ) : (
//                     "Create Account"
//                   )}
//                 </Button>
//               </form>
//             ) : (
//               <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="email">Email</Label>
//                   <Input
//                     id="email"
//                     type="email"
//                     placeholder="john@example.com"
//                     {...signInForm.register("email")}
//                   />
//                   {signInForm.formState.errors.email && (
//                     <p className="text-destructive text-sm">
//                       {signInForm.formState.errors.email.message}
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="password">Password</Label>
//                   <Input
//                     id="password"
//                     type="password"
//                     placeholder="••••••••"
//                     {...signInForm.register("password")}
//                   />
//                   {signInForm.formState.errors.password && (
//                     <p className="text-destructive text-sm">
//                       {signInForm.formState.errors.password.message}
//                     </p>
//                   )}
//                 </div>

//                 <Button type="submit" variant="gold" className="w-full" disabled={isLoading}>
//                   {isLoading ? (
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                   ) : (
//                     "Sign In"
//                   )}
//                 </Button>
//               </form>
//             )}

//             <div className="mt-6 text-center">
//               <p className="text-muted-foreground">
//                 {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
//                 <button
//                   type="button"
//                   onClick={() => setIsSignUp(!isSignUp)}
//                   className="text-accent hover:underline font-medium"
//                 >
//                   {isSignUp ? "Sign In" : "Sign Up"}
//                 </button>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// }


import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Eye, EyeOff } from "lucide-react";

/* -------------------- Zod Schemas -------------------- */
/* 🇮🇳 Common validation rules for Indian users */

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signUpSchema = z
  .object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/* -------------------- Component -------------------- */

export default function Auth() {
  const [searchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(searchParams.get("mode") === "signup");
  const [isLoading, setIsLoading] = useState(false);

  // 🇮🇳 Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const signInForm = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const signUpForm = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSignIn = async (data) => {
    setIsLoading(true);
    const { error } = await signIn(data.email, data.password);
    setIsLoading(false);

    if (!error) {
      navigate("/dashboard");
    }
  };

  const handleSignUp = async (data) => {
    setIsLoading(true);
    const { error } = await signUp(data.email, data.password, data.fullName);
    setIsLoading(false);

    if (!error) {
      navigate("/dashboard");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen pt-32 pb-20 px-4 bg-secondary">
        <div className="max-w-md mx-auto">
          <div className="bg-card rounded-lg shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-serif font-bold mb-2">
                {isSignUp ? "Create Account" : "Welcome Back"}
              </h1>
              <p className="text-muted-foreground">
                {isSignUp
                  ? "Create an account to manage your hotel bookings"
                  : "Sign in to view and manage your bookings"}
              </p>
            </div>

            {isSignUp ? (
              <form
                onSubmit={signUpForm.handleSubmit(handleSignUp)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="Rahul Sharma"
                    {...signUpForm.register("fullName")}
                  />
                  {signUpForm.formState.errors.fullName && (
                    <p className="text-destructive text-sm">
                      {signUpForm.formState.errors.fullName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="rahul@example.com"
                    {...signUpForm.register("email")}
                  />
                  {signUpForm.formState.errors.email && (
                    <p className="text-destructive text-sm">
                      {signUpForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Sign Up Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...signUpForm.register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {signUpForm.formState.errors.password && (
                    <p className="text-destructive text-sm">
                      {signUpForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...signUpForm.register("confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {signUpForm.formState.errors.confirmPassword && (
                    <p className="text-destructive text-sm">
                      {signUpForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="gold"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            ) : (
              <form
                onSubmit={signInForm.handleSubmit(handleSignIn)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="rahul@example.com"
                    {...signInForm.register("email")}
                  />
                  {signInForm.formState.errors.email && (
                    <p className="text-destructive text-sm">
                      {signInForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Sign In Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showLoginPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...signInForm.register("password")}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowLoginPassword(!showLoginPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showLoginPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {signInForm.formState.errors.password && (
                    <p className="text-destructive text-sm">
                      {signInForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="gold"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                {isSignUp
                  ? "Already have an account?"
                  : "New user?"}{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-accent hover:underline font-medium"
                >
                  {isSignUp ? "Sign In" : "Create an account"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
