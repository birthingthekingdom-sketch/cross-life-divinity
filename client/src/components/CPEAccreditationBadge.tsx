import { Award, CheckCircle2 } from "lucide-react";

// Function to determine if a color is light or dark
function getContrastColor(hexColor: string): string {
  // Remove # if present
  const hex = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate luminance using relative luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return white text for dark backgrounds, black text for light backgrounds
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

interface CPEAccreditationBadgeProps {
  cpeHours?: number;
  colorTheme?: string;
}

export function CPEAccreditationBadge({ 
  cpeHours = 2.5, 
  colorTheme = "#1e40af" 
}: CPEAccreditationBadgeProps) {
  return (
    <div className="mb-8">
      <div 
        className="rounded-lg p-6 shadow-lg border-2"
        style={{ 
          backgroundColor: colorTheme,
          borderColor: `${colorTheme}99`,
          color: getContrastColor(colorTheme)
        }}
      >
        <div className="flex items-start gap-4 flex-wrap">
          {/* Badge Icon */}
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm">
              <Award className="h-8 w-8" style={{ color: getContrastColor(colorTheme) }} />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-[250px]">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-bold">Clinical Pastoral Education (CPE) Training</h3>
              <CheckCircle2 className="h-5 w-5" style={{ color: getContrastColor(colorTheme) }} />
            </div>
            
            <p className="mb-4" style={{ opacity: 0.9, color: getContrastColor(colorTheme) }}>
              This course provides comprehensive Clinical Pastoral Education (CPE) training for chaplaincy professionals. Our program focuses on developing pastoral care competencies through supervised clinical practice, theological reflection, and professional development in institutional settings.
            </p>

            {/* Credits and Provider Info */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="text-sm font-medium" style={{ color: getContrastColor(colorTheme), opacity: 0.8 }}>CPE Credits</div>
                <div className="text-2xl font-bold mt-1" style={{ color: getContrastColor(colorTheme) }}>{cpeHours}</div>
                <div className="text-xs" style={{ color: getContrastColor(colorTheme), opacity: 0.7 }}>Contact Hours</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="text-sm font-medium" style={{ color: getContrastColor(colorTheme), opacity: 0.8 }}>Program Focus</div>
                <div className="text-lg font-bold mt-1" style={{ color: getContrastColor(colorTheme) }}>Chaplaincy</div>
                <div className="text-xs" style={{ color: getContrastColor(colorTheme), opacity: 0.7 }}>Professional Training</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="text-sm font-medium" style={{ color: getContrastColor(colorTheme), opacity: 0.8 }}>Certification</div>
                <div className="text-lg font-bold mt-1" style={{ color: getContrastColor(colorTheme) }}>CPE</div>
                <div className="text-xs" style={{ color: getContrastColor(colorTheme), opacity: 0.7 }}>Professional Standard</div>
              </div>
            </div>

            {/* Footer Note */}
            <p className="text-xs mt-4" style={{ color: getContrastColor(colorTheme), opacity: 0.7 }}>
              Upon course completion, participants will receive a certificate of completion recognizing their CPE training and professional development in chaplaincy ministry.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
