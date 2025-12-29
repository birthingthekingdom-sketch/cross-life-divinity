import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import { getCourseSlideshow } from "@/data/course-slideshows";

interface CourseIntroSlideshowProps {
  courseCode: string;
  courseTitle: string;
}

export function CourseIntroSlideshow({ courseCode, courseTitle }: CourseIntroSlideshowProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Get the correct slideshow for this specific course
  const slideshow = getCourseSlideshow(courseCode);

  useEffect(() => {
    if (!slideshow || !isAutoPlaying) return;

    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slideshow.slides.length);
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentSlide, isAutoPlaying, slideshow]);

  if (!slideshow) {
    return null;
  }

  const slide = slideshow.slides[currentSlide];

  const handlePrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slideshow.slides.length) % slideshow.slides.length);
    setIsAutoPlaying(false);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slideshow.slides.length);
    setIsAutoPlaying(false);
  };

  return (
    <Card className="mb-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">
          {slideshow.courseTitle} - Introduction
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Slide Content */}
        <div className="bg-white/50 dark:bg-slate-900/50 rounded-lg p-6 min-h-[300px] flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">{slide.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{slide.subtitle}</p>
            <p className="text-base leading-relaxed mb-4">{slide.content}</p>
            <div className="space-y-2">
              <p className="text-sm font-semibold">Key Points:</p>
              <ul className="space-y-1">
                {slide.keyPoints.map((point, idx) => (
                  <li key={idx} className="text-sm flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={slideshow.slides.length <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={slideshow.slides.length <= 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {currentSlide + 1} / {slideshow.slides.length}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Slide Indicators */}
        <div className="flex gap-1 justify-center">
          {slideshow.slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentSlide(idx);
                setIsAutoPlaying(false);
              }}
              className={`h-2 rounded-full transition-all ${
                idx === currentSlide
                  ? "bg-primary w-6"
                  : "bg-muted hover:bg-muted-foreground/50 w-2"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
