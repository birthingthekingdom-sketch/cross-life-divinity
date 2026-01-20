import { Award, CheckCircle2 } from "lucide-react";

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
        className="rounded-lg p-6 text-white shadow-lg border-2"
        style={{ 
          backgroundColor: colorTheme,
          borderColor: `${colorTheme}99`
        }}
      >
        <div className="flex items-start gap-4 flex-wrap">
          {/* Badge Icon */}
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm">
              <Award className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-[250px]">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-bold">Clinical Pastoral Education (CPE) Training</h3>
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            
            <p className="text-white/90 mb-4">
              This course provides comprehensive Clinical Pastoral Education (CPE) training for chaplaincy professionals. Our program focuses on developing pastoral care competencies through supervised clinical practice, theological reflection, and professional development in institutional settings.
            </p>

            {/* Credits and Provider Info */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="text-sm text-white/80 font-medium">CPE Credits</div>
                <div className="text-2xl font-bold mt-1">{cpeHours}</div>
                <div className="text-xs text-white/70">Contact Hours</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="text-sm text-white/80 font-medium">Program Focus</div>
                <div className="text-lg font-bold mt-1">Chaplaincy</div>
                <div className="text-xs text-white/70">Professional Training</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="text-sm text-white/80 font-medium">Certification</div>
                <div className="text-lg font-bold mt-1">CPE</div>
                <div className="text-xs text-white/70">Professional Standard</div>
              </div>
            </div>

            {/* Footer Note */}
            <p className="text-xs text-white/70 mt-4">
              Upon course completion, participants will receive a certificate of completion recognizing their CPE training and professional development in chaplaincy ministry.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
