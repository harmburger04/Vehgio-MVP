import { useState, useEffect } from "react";

interface PSGCItem {
  code: string;
  name: string;
}

// Metro Manila region code
const METRO_MANILA_CODE = "130000000";

export function useCities() {
  const [cities, setCities] = useState<PSGCItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://psgc.gitlab.io/api/regions/${METRO_MANILA_CODE}/cities-municipalities/`)
      .then((res) => res.json())
      .then((data: PSGCItem[]) => {
        setCities(data.sort((a, b) => a.name.localeCompare(b.name)));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { cities, loading };
}

export function useBarangays(cityCode: string) {
  const [barangays, setBarangays] = useState<PSGCItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cityCode) {
      setBarangays([]);
      return;
    }
    setLoading(true);
    fetch(`https://psgc.gitlab.io/api/cities-municipalities/${cityCode}/barangays/`)
      .then((res) => res.json())
      .then((data: PSGCItem[]) => {
        setBarangays(data.sort((a, b) => a.name.localeCompare(b.name)));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [cityCode]);

  return { barangays, loading };
}
