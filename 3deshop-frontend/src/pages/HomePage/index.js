import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Home() {
  const { getToken } = useAuth();

  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}
