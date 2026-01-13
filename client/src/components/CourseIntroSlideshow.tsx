import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, AlertCircle } from 'lucide-react';

interface CourseIntroSlideshowProps {
  courseId: string | number;
  courseName: string;
  autoPlay?: boolean;
}

interface SlideState {
  project_info: {
    title: string;
    total_slides: number;
  };
  slides: { [key: string]: string };
  outline: Array<{
    id: string;
    title: string;
    summary: string;
  }>;
}

export function CourseIntroSlideshow({ courseId, courseName, autoPlay = true }: CourseIntroSlideshowProps) {
  // Ensure courseId is a string
  const courseIdStr = String(courseId);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [slidesAvailable, setSlidesAvailable] = useState(true);
  const [slides, setSlides] = useState<Array<{ id: string; title: string }>>([]);
  const [loading, setLoading] = useState(true);

  // Map course IDs to their slideshow paths
  const slideshowMap: { [key: string]: string } = {
    // GED Courses
    'GED-MATH': '/course-intros/ged-math',
    'GED-LANG': '/course-intros/ged-lang',
    'GED-SCI': '/course-intros/ged-science',
    'GED-SOCIAL': '/course-intros/ged-social-studies',
    // Ministry Courses
    'DIV101': '/course-intros/understanding-prophecy',
    'MIN201': '/course-intros/fivefold-ministry',
    'MIN301': '/course-intros/deliverance-ministry',
    'THE201': '/course-intros/systematic-theology',
    'BIB201': '/course-intros/biblical-hermeneutics',
    'THE301': '/course-intros/fundamentals-of-apologetics',
    'MIN101': '/course-intros/evangelism-and-discipleship',
    'MIN102': '/course-intros/discipleship-training',
    'SPR101': '/course-intros/prayer-and-intercession',
    'LED201': '/course-intros/christian-leadership',
    'LED202': '/course-intros/christian-leadership',
    'PAS201': '/course-intros/pastoral-counseling',
    'PAS301': '/course-intros/church-administration',
    'PAS101': '/course-intros/homiletics',
    'SPR201': '/course-intros/discovering-spiritual-gifts',
    'DIV111': '/course-intros/capstone-project',
    'DIV112': '/course-intros/christology',
    'DIV113': '/course-intros/contemporary-theological-issues',
    'DIV102': '/course-intros/deliverance-ministry',
    'BIB101': '/course-intros/old-testament-survey',
    'BIB102': '/course-intros/new-testament-survey',
  };

  const basePath = slideshowMap[courseIdStr] || `/course-intros/${courseIdStr.toLowerCase()}`;
  const voiceoverPath = `${basePath}/intro-voiceover.wav`;

  // Load slide state from JSON
  useEffect(() => {
    const loadSlideState = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${basePath}/slide_state.json`);
        if (!response.ok) {
          setSlidesAvailable(false);
          setLoading(false);
          return;
        }
        
        const slideState: SlideState = await response.json();
        
        // Build slides array from outline
        const slidesArray = slideState.outline.map((item) => ({
          id: item.id,
          title: item.title,
        }));
        
        setSlides(slidesArray);
        setSlidesAvailable(true);
      } catch (error) {
        console.error('Error loading slide state:', error);
        setSlidesAvailable(false);
      } finally {
        setLoading(false);
      }
    };

    loadSlideState();
  }, [basePath]);

  // Check if current slide file exists
  useEffect(() => {
    if (slides.length === 0) return;
    
    // Construct the slide filename using the pattern: slide_{number}_{id}.html
  // where number is 1-based index and id is from the outline
  const currentSlideId = slides[currentSlide]?.id || '';
  const currentSlideFile = `${basePath}/slide_${currentSlide + 1}_${currentSlideId}.html`;
    fetch(currentSlideFile, { method: 'HEAD' })
      .then(res => setSlidesAvailable(res.ok))
      .catch(() => setSlidesAvailable(false));
  }, [currentSlide, slides, basePath]);

  // Initialize audio element on mount
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.src = voiceoverPath;
      audio.preload = 'auto';
      audio.currentTime = 0;
      audioRef.current = audio;
      
      // Auto-play when ready
      const handleCanPlay = () => {
        if (autoPlay && !hasStarted) {
          audio.play().catch(err => console.log('Autoplay failed:', err));
          setHasStarted(true);
        }
      };
      
      audio.addEventListener('canplay', handleCanPlay);
      
      return () => {
        audio.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, [autoPlay, hasStarted]);

  // Update audio source when voiceover path changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = voiceoverPath;
      audioRef.current.currentTime = 0;
      
      // Auto-play when source changes
      if (autoPlay && isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log('Audio play failed:', error);
          });
        }
      }
    }
  }, [voiceoverPath, autoPlay, isPlaying]);

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Audio play failed:', error);
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Handle mute
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.muted = isMuted;
  }, [isMuted]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  if (loading) {
    return (
      <div className="w-full bg-gray-50 rounded-lg overflow-hidden shadow-lg">
        <div className="relative bg-white p-8 flex items-center justify-center" style={{ aspectRatio: '16 / 9' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading course introduction...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!slidesAvailable || slides.length === 0) {
    return (
      <div className="w-full bg-gray-50 rounded-lg overflow-hidden shadow-lg">
        <div className="relative bg-white p-8">
          <div className="flex items-center gap-3 text-amber-600 mb-4">
            <AlertCircle className="h-5 w-5" />
            <p className="font-medium">Course introduction slides not yet available</p>
          </div>
          <p className="text-muted-foreground">
            The interactive introduction slides for this course are being prepared. Please check back soon!
          </p>
        </div>
      </div>
    );
  }

  // Construct the slide filename using the pattern: slide_{number}_{id}.html
  // where number is 1-based index and id is from the outline
  const currentSlideId = slides[currentSlide]?.id || '';
  const currentSlideFile = `${basePath}/slide_${currentSlide + 1}_${currentSlideId}.html`;

  return (
    <div className="w-full bg-gray-50 rounded-lg overflow-hidden shadow-lg">
      {/* Slideshow Container */}
      <div className="relative bg-white" style={{ aspectRatio: '16 / 9', overflow: 'hidden' }}>
        <iframe
          key={currentSlideFile}
          src={currentSlideFile}
          className="w-full h-full"
          style={{ border: 'none', display: 'block' }}
          title={`${courseName} - ${slides[currentSlide].title}`}
          sandbox="allow-same-origin"
        />
      </div>

      {/* Controls */}
      <div className="bg-primary text-white p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="p-2 hover:bg-primary/80 rounded transition-colors"
              title="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="text-sm font-medium">
              {currentSlide + 1} / {slides.length}
            </div>

            <button
              onClick={nextSlide}
              className="p-2 hover:bg-primary/80 rounded transition-colors"
              title="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Slide Indicators */}
          <div className="flex gap-1">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide ? 'bg-white w-6' : 'bg-white/50 w-2'
                }`}
                title={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Audio Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlayPause}
              className="p-2 hover:bg-primary/80 rounded transition-colors"
              title={isPlaying ? 'Pause voiceover' : 'Play voiceover'}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </button>

            <button
              onClick={toggleMute}
              className="p-2 hover:bg-primary/80 rounded transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Slide Title */}
        <div className="mt-3 text-center text-sm font-medium">
          {slides[currentSlide]?.title || 'Course Introduction'}
        </div>
      </div>
    </div>
  );
}
