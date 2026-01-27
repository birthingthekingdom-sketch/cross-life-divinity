interface VideoPlayerProps {
  url: string;
  title?: string;
  className?: string;
}

export function VideoPlayer({ url, title, className = "" }: VideoPlayerProps) {
  // Extract video ID and platform from URL
  const getEmbedUrl = (videoUrl: string): string | null => {
    // YouTube patterns
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = videoUrl.match(youtubeRegex);
    if (youtubeMatch && youtubeMatch[1]) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    // Vimeo patterns
    const vimeoRegex = /vimeo\.com\/(?:video\/)?(\d+)/;
    const vimeoMatch = videoUrl.match(vimeoRegex);
    if (vimeoMatch && vimeoMatch[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    // Direct embed URLs (already in embed format)
    if (videoUrl.includes('youtube.com/embed/') || videoUrl.includes('player.vimeo.com/video/')) {
      return videoUrl;
    }

    // If it's a direct video file URL (.mp4, .webm, etc.)
    if (/\.(mp4|webm|ogg)$/i.test(videoUrl)) {
      return videoUrl;
    }

    return null;
  };

  const embedUrl = getEmbedUrl(url);

  if (!embedUrl) {
    return (
      <div className={`bg-muted rounded-lg p-8 text-center ${className}`}>
        <p className="text-muted-foreground">Invalid video URL format</p>
        <p className="text-sm text-muted-foreground mt-2">
          Supported: YouTube, Vimeo, or direct video files (.mp4, .webm, .ogg)
        </p>
      </div>
    );
  }

  // Check if it's a direct video file
  const isDirectVideo = /\.(mp4|webm|ogg)$/i.test(embedUrl);

  if (isDirectVideo) {
    return (
      <div className={`relative w-full ${className}`} style={{ paddingBottom: '56.25%' }}>
        <video
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          controls
          title={title || "Video"}
        >
          <source src={embedUrl} type={`video/${embedUrl.split('.').pop()}`} />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  // Embed iframe for YouTube/Vimeo
  return (
    <div className={`relative w-full ${className}`} style={{ paddingBottom: '56.25%' }}>
      <iframe
        className="absolute top-0 left-0 w-full h-full rounded-lg border-0"
        src={embedUrl}
        title={title || "Video"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
