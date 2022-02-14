import React from "react";
import { useAuth } from "../../hooks/useAuth";

export default function Home() {
  const { token } = useAuth();

  return (
    <div>
      {token && <h1>Hello {token}</h1>}
      <h1>Home</h1>
    </div>
  );
}
