"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Train } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [cin, setCIN] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ nom: name, email, password, cin }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      router.push("/");
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("Unknown error", err);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Train className="h-8 w-8" />
            <span className="text-2xl font-bold">RailTime</span>
          </Link>
          <h1 className="text-2xl font-bold text-balance">Create Account</h1>
          <p className="text-muted-foreground text-balance">
            Join RailTime to book tickets and manage your trips
          </p>
        </div>

        {/* Register Form */}
        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>
              Create your account to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cin">CIN</Label>
                <Input
                  id="cin"
                  type="text"
                  placeholder="xxxx"
                  value={cin}
                  onChange={(e) => setCIN(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                />
              </div>
              <div className="flex items-start gap-2 text-sm">
                <input type="checkbox" className="rounded mt-0.5" />
                <label className="text-muted-foreground">
                  I agree to the{" "}
                  <Link href="#" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? "Creating Account ..." : "Create Account"}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Additional Options */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground mb-4">Or register with</p>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full bg-transparent">
              Google
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              Facebook
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
