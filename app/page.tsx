import Link from "next/link";
export default function Home() {
  return (
    <div>
      <h1>Welcome to our website!</h1>
      <p>Some information about the website...</p>
      <Link href="/Account/Login">
        Login
      </Link>
      <Link href="/Account/Register">
        Register
      </Link>
    </div>
  );
}