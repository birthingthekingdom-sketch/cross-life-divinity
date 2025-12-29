import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface CourseIntroSlideshowProps {
  courseId: string;
  courseName: string;
  autoPlay?: boolean;
}

export function CourseIntroSlideshow({ courseId, courseName, autoPlay = true }: CourseIntroSlideshowProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);

  const slides = [
    { id: 'slide_1_title', title: 'Understanding Prophecy' },
    { id: 'slide_2_objectives', title: 'Course Objectives' },
    { id: 'slide_3_topics', title: 'What You\'ll Learn' },
    { id: 'slide_4_structure', title: 'Course Structure' },
    { id: 'slide_5_commitment', title: 'Your Learning Journey' },
  ];

  // Map course IDs to their slideshow paths
  const slideshowMap: { [key: string]: string } = {
    'DIV101': '/course-intros/understanding-prophecy',
    'MIN201': '/course-intros/fivefold-ministry',
    'MIN301': '/course-intros/deliverance-ministry',
    'THE201': '/course-intros/systematic-theology',
    'BIB201': '/course-intros/biblical-hermeneutics',
    'THE301': '/course-intros/fundamentals-apologetics',
    'MIN101': '/course-intros/evangelism-discipleship',
    'MIN102': '/course-intros/discipleship-training',
    'SPR101': '/course-intros/prayer-intercession',
    'LED201': '/course-intros/christian-leadership',
    'PAS201': '/course-intros/pastoral-counseling',
    'PAS301': '/course-intros/church-administration',
    'PAS101': '/course-intros/homiletics',
    'SPR201': '/course-intros/discovering-spiritual-gifts',
  };

  const basePath = slideshowMap[courseId] || `/course-intros/${courseId.toLowerCase()}`;
  const currentSlideFile = `${basePath}/${slides[currentSlide].id}.html`;
  const voiceoverPath = `${basePath}/intro-voiceover.wav`;

  useEffect(() => {
    // Create audio element if not exists
    if (!audioRef) {
      const audio = new Audio(voiceoverPath);
      audio.loop = false;
      setAudioRef(audio);
    }
  }, [audioRef, voiceoverPath]);

  useEffect(() => {
    if (!audioRef) return;

    if (isPlaying) {
      audioRef.play().catch(err => console.log('Audio play failed:', err));
    } else {
      audioRef.pause();
    }
  }, [isPlaying, audioRef]);

  useEffect(() => {
    if (!audioRef) return;
    audioRef.muted = isMuted;
  }, [isMuted, audioRef]);

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

  return (
    <div className="w-full bg-gray-50 rounded-lg overflow-hidden shadow-lg">
      {/* Slideshow Container */}
      <div className="relative bg-white">
        <iframe
          src={currentSlideFile}
          className="w-full"
          style={{ height: '480px', border: 'none' }}
          title={`${courseName} - ${slides[currentSlide].title}`}
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
          {slides[currentSlide].title}
        </div>
      </div>
    </div>
  );
}
