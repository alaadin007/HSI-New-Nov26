"use client";

import { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Newspaper, GraduationCap, BookOpen, X } from "lucide-react";
import { CoursesList } from "@/components/courses-list";
import { NewsUpdates } from "@/components/news-updates";
import { AnimatePresence, motion } from "framer-motion";

const categories = [
  {
    title: "News & Updates",
    icon: Newspaper,
    content: "Stay informed with the latest developments in aesthetic medicine, industry trends, and institute announcements.",
    component: NewsUpdates
  },
  {
    title: "Courses",
    icon: GraduationCap,
    content: "Explore our comprehensive range of aesthetic medicine courses, from foundation to advanced specialization.",
    component: CoursesList
  },
  {
    title: "Resources",
    icon: BookOpen,
    content: "Access educational materials, clinical guidelines, and research papers to support your professional development.",
  },
];

export function CategoryCards() {
  const [mounted, setMounted] = useState(false);
  const [lightPosition, setLightPosition] = useState(-100);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateLightPosition = useCallback(() => {
    setLightPosition(prev => prev > 100 ? -100 : prev + 0.5);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(updateLightPosition, 20);
    return () => clearInterval(interval);
  }, [mounted, updateLightPosition]);

  const handleCategoryClick = (title: string) => {
    setActiveCategory(activeCategory === title ? null : title);
  };

  const ActiveComponent = categories.find(c => c.title === activeCategory)?.component;

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card 
            key={category.title}
            className="relative overflow-hidden backdrop-blur-sm 
                     border-primary/5 bg-primary/[0.02]"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 text-primary/40">
                <category.icon className="h-6 w-6" />
                <h2 className="text-lg font-semibold">{category.title}</h2>
              </div>
              <p className="text-sm text-muted-foreground/60">
                {category.content}
              </p>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="relative w-full overflow-hidden">
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(90deg, 
              transparent 0%, 
              rgba(255,255,255,0.07) ${lightPosition - 5}%, 
              rgba(255,255,255,0.1) ${lightPosition}%, 
              rgba(255,255,255,0.07) ${lightPosition + 5}%, 
              transparent 100%)`
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card 
              key={category.title}
              className="group relative overflow-hidden backdrop-blur-sm 
                       border-primary/5 bg-primary/[0.02] hover:bg-primary/[0.03]
                       transition-all duration-500 cursor-pointer"
              onClick={() => category.component && handleCategoryClick(category.title)}
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-primary/40 group-hover:text-primary/60 transition-colors duration-500">
                  <category.icon className="h-6 w-6" />
                  <h2 className="text-lg font-semibold">{category.title}</h2>
                </div>
                <p className="text-sm text-muted-foreground/60 group-hover:text-muted-foreground/80 transition-colors duration-500">
                  {category.content}
                </p>
              </div>

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/5" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {mounted && activeCategory && ActiveComponent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-auto rounded-xl bg-background shadow-xl border"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-background/95">
                <h2 className="text-xl font-semibold">{activeCategory}</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setActiveCategory(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4">
                <ActiveComponent onClose={() => setActiveCategory(null)} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}