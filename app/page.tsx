import { Item, ItemTitle } from "@/components/ui/item";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background font-sans dark:bg-background">
      <Item className="bg-primary text-secondary">
        <ItemTitle>Hello</ItemTitle>
      </Item>
    </div>
  );
}
