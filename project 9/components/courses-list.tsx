"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";

const courseGroups = [
  {
    title: "Beginners",
    description: "Start your journey in aesthetic medicine",
    courses: [
      "Foundation Botox & Dermal Fillers Courses",
      "Botox Training For Medical Professionals",
      "Advanced Botox And Fillers Courses",
      "Polynucleotides Course",
      "Skin Rejuvenation Course"
    ]
  },
  {
    title: "Combined Programmes",
    description: "Accelerated Learning Pathways",
    courses: [
      "Facial Aesthetic Certificate - Expert Level",
      "Certificate In Aesthetic Medicine",
      "Fellowship In Aesthetic Medicine"
    ]
  },
  {
    title: "Master Classes",
    description: "Advanced specialized training",
    courses: [
      "Cannula Skill Training Masterclass",
      "PDO Thread Training",
      "Lip Filler Masterclass",
      "Chin & Jaw Masterclass",
      "Nose Masterclass",
      "Cheeks Masterclass",
      "Tear Trough Masterclass"
    ]
  },
  {
    title: "Popular Online Courses",
    description: "Learn at your own pace",
    courses: [
      "Masseter Botox (Wide Jaw, Bruxism/TMJ)",
      "Hyperhidrosis",
      "Gummy Smile, Nose Tip DAO",
      "Hyaluronidase (Complication Management)"
    ]
  }
];

interface CoursesListProps {
  onClose: () => void;
}

export function CoursesList({ onClose }: CoursesListProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-6xl max-h-[90vh] overflow-auto rounded-xl bg-[#0a0b0f]/95 shadow-2xl"
      >
        {/* Ambient background effect */}
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-gradient" />
          <div className="absolute -inset-[500px] bg-[radial-gradient(40%_50%_at_50%_50%,rgba(56,189,248,0.05)_0%,rgba(56,189,248,0)_100%)] animate-pulse-slow" />
        </div>

        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-white/5 bg-[#0a0b0f]/95">
          <div>
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-white"
            >
              Aesthetic Courses
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-blue-300/60"
            >
              Comprehensive aesthetic medicine training programs
            </motion.p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/5 transition-colors group"
          >
            <X className="w-5 h-5 text-white/70 group-hover:text-white/90 transition-colors" />
          </button>
        </div>

        <div className="relative p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {courseGroups.map((group, groupIndex) => (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: groupIndex * 0.1 }}
                className="relative space-y-6 p-6 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
              >
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {group.title}
                  </h3>
                  <p className="text-sm text-blue-300/60 mt-1">
                    {group.description}
                  </p>
                </div>

                <div className="space-y-3">
                  {group.courses.map((course, courseIndex) => (
                    <motion.div
                      key={course}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: (groupIndex * 0.1) + (courseIndex * 0.05) }}
                      className="group cursor-pointer relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-transparent transition-all duration-300 rounded-lg" />
                      <div className="relative flex items-center gap-3 py-2 px-3 rounded-lg group-hover:bg-white/[0.02] transition-colors">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500/40 group-hover:bg-blue-500 group-hover:shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all duration-300" />
                        <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                          {course}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Decorative corner gradient */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}