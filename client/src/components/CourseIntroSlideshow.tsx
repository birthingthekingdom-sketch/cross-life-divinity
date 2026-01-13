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
  const [slides, setSlides] = useState<Array<{ id: string; title: string; slideNumber: number }>>([]);
  const [loading, setLoading] = useState(true);

  // Map course codes to their slide IDs in the all-courses presentation
  const courseSlideMap: { [key: string]: string } = {
    'BIB101': 'bib101_old_testament',
    'BIB102': 'bib102_new_testament',
    'THE201': 'the201_systematic_theology',
    'BIB201': 'bib201_biblical_hermeneutics',
    'DIV101': 'div101_understanding_prophecy',
    'THE301': 'the301_fundamentals_apologetics',
    'DIV102': 'div102_deliverance_ministry',
    'MIN101': 'min101_evangelism_discipleship',
    'MIN102': 'min102_discipleship_training',
    'SPR101': 'spr101_prayer_intercession',
    'LED202': 'led202_christian_leadership',
    'PAS201': 'pas201_pastoral_counseling',
    'PAS301': 'pas301_church_administration',
    'PAS101': 'pas101_homiletics',
    'SPR201': 'spr201_spiritual_gifts',
    'WOR101': 'wor101_biblical_worship',
    'DIV111': 'div111_capstone_project',
    'DIV112': 'div112_christology',
    'DIV113': 'div113_contemporary_theological',
  };

  const basePath = '/course-intros/all-courses';
  const courseSlideId = courseSlideMap[courseIdStr];
  const voiceoverPath = `${basePath}/${courseIdStr}_voiceover.wav`;

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
        
        // Find the course slide in the outline
        if (!courseSlideId) {
          console.warn(`No slide mapping found for course: ${courseIdStr}`);
          setSlidesAvailable(false);
          setLoading(false);
          return;
        }

        // Find the slide number for this course
        const courseSlideIndex = slideState.outline.findIndex(slide => slide.id === courseSlideId);
        if (courseSlideIndex === -1) {
          console.warn(`Course slide not found in outline: ${courseSlideId}`);
          setSlidesAvailable(false);
          setLoading(false);
          return;
        }

        // Create a single-slide array for this course
        const courseSlide = slideState.outline[courseSlideIndex];
        const slidesArray = [{
          id: courseSlide.id,
          title: courseSlide.title,
          slideNumber: courseSlideIndex + 1, // 1-based index
        }];
        
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
  }, [basePath, courseSlideId, courseIdStr]);

  // Check if current slide file exists
  useEffect(() => {
    if (slides.length === 0) return;
    
    const currentSlide = slides[0];
    const currentSlideFile = `${basePath}/slide_${currentSlide.slideNumber}_${currentSlide.id}.html`;
    fetch(currentSlideFile, { method: 'HEAD' })
      .then(res => setSlidesAvailable(res.ok))
      .catch(() => setSlidesAvailable(false));
  }, [slides, basePath]);

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

  // Get the course slide
  const courseSlide = slides[0];
  const currentSlideFile = `${basePath}/slide_${courseSlide.slideNumber}_${courseSlide.id}.html`;

  return (
    <div className="w-full bg-gray-50 rounded-lg overflow-hidden shadow-lg">
      {/* Lesson Header */}
      <div className="bg-primary text-white px-6 py-3">
        <h3 className="text-lg font-semibold">{courseIdStr}: Course Introduction</h3>
      </div>

      {/* Slideshow Container */}
      <div className="relative bg-white" style={{ aspectRatio: '16 / 9', overflow: 'hidden' }}>
        <iframe
          key={currentSlideFile}
          src={currentSlideFile}
          className="w-full h-full"
          style={{ border: 'none', display: 'block' }}
          title={`${courseName} - ${courseSlide.title}`}
          sandbox="allow-same-origin"
        />
      </div>

      {/* Controls */}
      <div className="bg-primary text-white p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Navigation - Hidden since there's only one slide per course */}
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium">
              1 / 1
            </div>
          </div>

          {/* Slide Indicators - Hidden since there's only one slide */}
          <div className="flex gap-1">
            <button
              className="h-2 rounded-full bg-white w-6"
              title="Course introduction slide"
            />
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
          {courseSlide.title}
        </div>
      </div>
    </div>
  );
}
