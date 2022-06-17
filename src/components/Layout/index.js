import React from "react";
import ResponsiveAppBar from "./AppBar";

export default function Layout({ page }) {
  return (
    <div>
      <ResponsiveAppBar />
      {page}
    </div>
  );
}
