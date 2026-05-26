import { useState } from "react";

export const useFormStatus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = async (callback: () => Promise<void>) => {
    setLoading(true);
    setError("");
    try {
      await callback();
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Something went wrong.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return { error, loading, run, setError };
};
