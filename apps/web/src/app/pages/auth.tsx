import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../../services/api";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { toast } from "sonner";
import { auth } from "../../firebase/firebase";

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      await setPersistence(auth, browserLocalPersistence);

      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const idToken = await userCredential.user.getIdToken();

      const response = await authAPI.login(idToken);
      if (response.error) {
        toast.error(response.error);
        return;
      }

      toast.success("Google sign-in successful!");
      navigate("/");
    } catch (error: any) {
      console.error("Google auth error:", error);
      toast.error(error?.message || "Google authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLogin && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await setPersistence(auth, browserLocalPersistence);

      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await userCredential.user.getIdToken();
        const response = await authAPI.login(idToken);
        if (response.error) {
          toast.error(response.error);
          return;
        }
        setPassword("");
        setConfirmPassword("");
        toast.success("Login successful!");
        navigate("/");
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const idToken = await userCredential.user.getIdToken();
        const response = await authAPI.signup(idToken, displayName);
        if (response.error) {
          toast.error(response.error);
          return;
        }
        setPassword("");
        setConfirmPassword("");
        toast.success("Account created successfully!");
        navigate("/");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast.error(error?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 space-y-6">
      <div className="text-sm text-gray-600">
        <Link to="/" className="text-[#00a8e8] hover:underline">
          Home
        </Link>{" "}
        /<span> {isLogin ? "Login" : "Register"}</span>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Login to Your Account" : "Create an Account"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="John Doe"
                required
                className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:border-[#00a8e8]"
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:border-[#00a8e8]"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:border-[#00a8e8]"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:border-[#00a8e8]"
              />
            </div>
          )}

          {isLogin && (
            <div className="flex justify-end">
              <a href="#" className="text-sm text-[#00a8e8] hover:underline">
                Forgot password?
              </a>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#00a8e8] hover:bg-[#0096d1] text-white rounded font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">or</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full py-3 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded-md font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#EA4335"
              d="M12 10.2v3.9h5.5c-.2 1.3-1.5 3.7-5.5 3.7-3.3 0-6.1-2.8-6.1-6.1s2.8-6.1 6.1-6.1c1.9 0 3.1.8 3.8 1.4l2.6-2.5C16.8 3 14.6 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.8 0 9.6-4.1 9.6-9.8 0-.7-.1-1.2-.2-2H12z"
            />
            <path
              fill="#34A853"
              d="M3.2 7.3l3.2 2.3C7.2 7.7 9.4 6 12 6c1.9 0 3.1.8 3.8 1.4l2.6-2.5C16.8 3 14.6 2 12 2 8.2 2 4.9 4.1 3.2 7.3z"
            />
            <path
              fill="#FBBC05"
              d="M12 22c2.5 0 4.7-.8 6.3-2.2l-2.9-2.3c-.8.6-1.9 1-3.4 1-2.6 0-4.8-1.7-5.6-4.1l-3.2 2.5C4.9 19.9 8.2 22 12 22z"
            />
            <path
              fill="#4285F4"
              d="M21.6 12.2c0-.7-.1-1.2-.2-1.8H12v3.9h5.5c-.3 1.2-1.1 2.3-2.1 3.1l2.9 2.3c1.7-1.6 3.3-4.1 3.3-7.5z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-gray-600"
          >
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span className="text-[#00a8e8] hover:underline">
              {isLogin ? "Register" : "Sign in"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}