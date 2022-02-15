import React, { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function Home() {
  const { onLogin } = useAuth();

  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}
