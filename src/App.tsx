import { ReactNode, useCallback, useEffect, useState } from "react";

function Button(props: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      className="bg-gray-300 active:bg-gray-200 hover:bg-gray-100 p-1"
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

function useSearchQuery(valueKey: string) {
  const [value, setValue] = useState("");
  useEffect(() => {
    let v = localStorage.getItem(valueKey);
    if (v === null) v = "";
    setValue(v);
    return () => localStorage.setItem(valueKey, value);
  }, [value, valueKey]);
  return [value, setValue] as const;
}

function Search({
  onClickOrMount,
}: {
  onClickOrMount: (value: string) => void;
}) {
  const VALUE_KEY = "search_term";
  const [value, setValue] = useSearchQuery(VALUE_KEY);
  const onClick = useCallback(() => {
    onClickOrMount(value);
    localStorage.setItem(VALUE_KEY, value);
  }, [value, onClickOrMount]);
  useEffect(() => {
    onClickOrMount(value);
  }, [onClickOrMount, value]);
  return (
    <div className="flex gap-1">
      <input
        type="text"
        className="border"
        placeholder="search query"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button onClick={onClick}>Search</Button>
    </div>
  );
}

type Product = {
  title: string;
  description: string;
  id: number;
};

function Items(props: { items: null | Product[] }) {
  if (props.items === null) return <div>loader</div>;
  return (
    <div className="flex flex-col gap-2">
      {props.items.map((item) => (
        <div className="border-2" key={item.id}>
          <div>{item.title}</div>
          <div>{item.description}</div>
        </div>
      ))}
    </div>
  );
}

function App() {
  const [items, setItems] = useState<Product[] | null>(null);
  const onClickOrMountSearch = useCallback(async (v: string) => {
    v = v.trim();
    const response = (await fetch(
      `https://dummyjson.com/products/search?select=title,description,number&q=${v}`,
    ).then((res) => res.json())) as {
      products: [Product];
    };
    setItems(response.products);
  }, []);

  return (
    <div className="p-6 flex flex-col gap-2">
      <div className="flex gap-5">
        <Search onClickOrMount={onClickOrMountSearch} />

        <Button onClick={() => setItems(8 as unknown as null)}>
          Throw an error
        </Button>
      </div>
      <Items items={items} />
    </div>
  );
}

export default App;
