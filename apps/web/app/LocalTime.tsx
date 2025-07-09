"use client";
import { useEffect, useState } from "react";

export default function LocalTime() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-sm text-gray-500 mt-1">
      {now.toLocaleString()}
    </div>
  );
}
