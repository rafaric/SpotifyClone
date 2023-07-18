"use client";

import useDebounce from "@/hooks/useDebounce";
import { useRouter } from "next/navigation";
import qs from "query-string";
import { useEffect, useState } from "react";
import Input from "./Input";

const SearchInput = () => {
  const router = useRouter();
  const [value, setValue] = useState<string>("");
  const debouncedValue = useDebounce<string>(value, 500);

  useEffect(() => {
    const query = { title: debouncedValue };
    const url = qs.stringifyUrl({ url: "/search", query: query });
    router.push(url);
  }, [debouncedValue, router]);

  return (
    <Input
      placeholder="Qué deseas escuchar?"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      autoFocus
    />
  );
};

export default SearchInput;
