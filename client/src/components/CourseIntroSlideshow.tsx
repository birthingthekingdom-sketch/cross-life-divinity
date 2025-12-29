import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Slide {
  id: number;
  title: string;
  content: string;
  bgColor: string;
}

interface CourseIntroSlideshowProps {
  courseCode: string;
  courseName: string;
  slides: Slide[];
  audioUrl: string;
  autoPlay?: boolean;
  slideDuration?: number; // Duration per slide in seconds
}

export const CourseIntroSlideshow: React.FC<CourseIntroSlideshowProps> = ({
  courseCode,
  courseName,
  slides,
  audioUrl,
  autoPlay = true,
  slideDuration = 8, // Default 8 seconds per slide
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Calculate total duration based on audio
  const getTotalDuration = () => {
    if (audioRef.current) {
      return audioRef.current.duration || slides.length * slideDuration;
    }
    return slides.length * slideDuration;
  };

  // Auto-advance slides based on audio progress
  useEffect(() => {
    if (!isPlaying || !audioRef.current) return;

    const audio = audioRef.current;
    const totalDuration = audio.duration || slides.length * slideDuration;
    const timePerSlide = totalDuration / slides.length;

    const updateSlide = () => {
      const currentTime = audio.currentTime;
      const slideIndex = Math.floor(currentTime / timePerSlide);
      
      if (slideIndex < slides.length) {
        setCurrentSlide(slideIndex);
      } else if (audio.ended) {
        // Loop back to first slide
        setCurrentSlide(0);
        audio.currentTime = 0;
      }
    };

    const interval = setInterval(updateSlide, 100);
    return () => {
      clearInterval(interval);
    };
  }, [isPlaying, slides.length, slideDuration]);

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch(() => {
        // Autoplay might be blocked, user needs to click play
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Handle mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    if (audioRef.current) {
      const totalDuration = audioRef.current.duration || slides.length * slideDuration;
      const timePerSlide = totalDuration / slides.length;
      audioRef.current.currentTime = Math.max(0, (currentSlide - 1) * timePerSlide);
    }
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    if (audioRef.current) {
      const totalDuration = audioRef.current.duration || slides.length * slideDuration;
      const timePerSlide = totalDuration / slides.length;
      audioRef.current.currentTime = Math.min(
        audioRef.current.duration || Infinity,
        (currentSlide + 1) * timePerSlide
      );
    }
  };

  const slide = slides[currentSlide];
  const progress = audioRef.current 
    ? (audioRef.current.currentTime / (audioRef.current.duration || getTotalDuration())) * 100 
    : 0;

  return (
    <div className="w-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Main Slideshow Area */}
      <div className={`relative ${slide.bgColor} min-h-[400px] flex flex-col items-center justify-center p-8 text-white transition-all duration-500`}>
        {/* Slide Content */}
        <div className="max-w-2xl text-center">
          <div className="mb-4 text-sm font-semibold text-white/70 uppercase tracking-widest">
            {courseCode} • Slide {currentSlide + 1} of {slides.length}
          </div>
          
          <h2 className="text-4xl font-bold mb-6 leading-tight">
            {slide.title}
          </h2>
          
          <p className="text-lg text-white/90 leading-relaxed">
            {slide.content}
          </p>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentSlide(index);
                if (audioRef.current) {
                  const totalDuration = audioRef.current.duration || slides.length * slideDuration;
                  const timePerSlide = totalDuration / slides.length;
                  audioRef.current.currentTime = index * timePerSlide;
                }
              }}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-white w-8'
                  : 'bg-white/40 w-2 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-t border-white/10 p-4">
        {/* Progress Bar */}
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xs text-white/60">
            {audioRef.current ? Math.floor(audioRef.current.currentTime) : 0}s
          </span>
          <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-white/60">
            {audioRef.current ? Math.floor(audioRef.current.duration || 0) : 0}s
          </span>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevSlide}
              className="text-white hover:bg-white/10"
              title="Previous slide"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-white hover:bg-white/10"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextSlide}
              className="text-white hover:bg-white/10"
              title="Next slide"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMuted(!isMuted)}
            className="text-white hover:bg-white/10"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        onEnded={() => {
          setCurrentSlide(0);
          setIsPlaying(false);
        }}
      />
    </div>
  );
};
