import { useState, useEffect } from "react";

interface CourseVideoPlayerProps {
  videoUrl: string;
  title?: string;
}

export default function CourseVideoPlayer({ videoUrl, title }: CourseVideoPlayerProps) {
  const [embedUrl, setEmbedUrl] = useState<string>("");
  const [videoType, setVideoType] = useState<"youtube" | "vimeo" | "direct">("direct");

  useEffect(() => {
    // Detect video type and convert to embed URL
    if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
      setVideoType("youtube");
      // Extract video ID from various YouTube URL formats
      let videoId = "";
      if (videoUrl.includes("youtu.be/")) {
        videoId = videoUrl.split("youtu.be/")[1].split("?")[0];
      } else if (videoUrl.includes("youtube.com/watch?v=")) {
        videoId = videoUrl.split("v=")[1].split("&")[0];
      } else if (videoUrl.includes("youtube.com/embed/")) {
        videoId = videoUrl.split("embed/")[1].split("?")[0];
      }
      setEmbedUrl(`https://www.youtube.com/embed/${videoId}`);
    } else if (videoUrl.includes("vimeo.com")) {
      setVideoType("vimeo");
      // Extract video ID from Vimeo URL
      const videoId = videoUrl.split("vimeo.com/")[1].split("?")[0];
      setEmbedUrl(`https://player.vimeo.com/video/${videoId}`);
    } else {
      setVideoType("direct");
      setEmbedUrl(videoUrl);
    }
  }, [videoUrl]);

  if (!embedUrl) {
    return null;
  }

  return (
    <div className="w-full bg-black rounded-lg overflow-hidden shadow-lg">
      {title && (
        <div className="bg-card p-3 border-b border-border">
          <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
        </div>
      )}
      <div className="relative" style={{ paddingBottom: "56.25%" }}>
        {videoType === "youtube" || videoType === "vimeo" ? (
          <iframe
            src={embedUrl}
            title={title || "Course Introduction Video"}
            className="absolute top-0 left-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            src={embedUrl}
            controls
            className="absolute top-0 left-0 w-full h-full"
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </div>
  );
}
