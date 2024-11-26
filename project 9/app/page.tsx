import { SearchBar } from "@/components/search-bar";
import { CategoryCards } from "@/components/category-cards";

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl mx-auto space-y-24">
        <h1 className="text-4xl font-bold text-center text-foreground/90">
          Welcome To Harley Street Institute
        </h1>
        <SearchBar />
        <CategoryCards />
      </div>
    </main>
  );
}