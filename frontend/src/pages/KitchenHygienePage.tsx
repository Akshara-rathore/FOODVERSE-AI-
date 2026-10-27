import React, { useState, useRef } from 'react';
import {
  UtensilsCrossed,
  Upload,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Video,
  ListChecks,
  AlertCircle,
  X,
  FileCheck2
} from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { api } from '../services/api';
import { HygieneAudit } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Alert } from '../components/ui/Alert';

export const KitchenHygienePage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<HygieneAudit | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const isVid = file.type.startsWith('video/') || /\.(mp4|mov|avi)$/i.test(file.name);
    const isImg = file.type.startsWith('image/');

    if (!isVid && !isImg) {
      setError('Please upload an image or video file (JPEG, PNG, MP4, MOV).');
      return;
    }
    setError(null);
    setSelectedFile(file);
    setIsVideo(isVid);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsVideo(false);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAudit = async () => {
    if (!selectedFile) {
      setError('Please select a kitchen workspace image or video first.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const data = await api.analyzeHygiene(formData);
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Hygiene audit failed. Please check file format or provider.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Kitchen Hygiene Audit"
      description="Automated HACCP hygiene coaching, surface contamination inspection, and corrective safety checklists."
    >
      <div className="space-y-6">
        <Alert
          variant="info"
          title="Hygiene Audit Advisory Disclaimer"
        >
          This automated computer-vision audit evaluates visual sanitation indicators and surface order. It does NOT certify FDA, local health department, or HACCP biological compliance. Laboratory bacterial swab tests remain essential for certified sanitation.
        </Alert>

        {error && (
          <Alert variant="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Upload Panel */}
          <div className="lg:col-span-5 space-y-4">
            <Card title="Upload Workspace Media">
              {!previewUrl ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer bg-background hover:bg-white hover:border-secondary/50 transition-all flex flex-col items-center justify-center min-h-[260px]"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/mp4,video/quicktime,video/x-msvideo"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFile(e.target.files[0]);
                      }
                    }}
                  />
                  <div className="w-12 h-12 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center mb-3">
                    <UtensilsCrossed className="w-6 h-6" />
                  </div>
                  <h4 className="font-heading font-semibold text-sm text-mainText mb-1">
                    Upload kitchen photo or video clip
                  </h4>
                  <p className="text-xs text-secondaryText max-w-xs mb-3">
                    Images or short video walkthroughs (MP4/MOV up to 35MB). OpenCV extracts representative frames.
                  </p>
                  <Button variant="outline" size="sm">
                    Select Workspace File
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden border border-border aspect-video bg-black/5 flex items-center justify-center">
                    {isVideo ? (
                      <video src={previewUrl} controls className="w-full h-full object-cover" />
                    ) : (
                      <img src={previewUrl} alt="Kitchen area" className="w-full h-full object-cover" />
                    )}
                    <button
                      onClick={handleReset}
                      className="absolute top-3 right-3 bg-darkNav/80 text-white p-1.5 rounded-lg backdrop-blur-sm"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="primary"
                      size="md"
                      className="flex-1"
                      loading={loading}
                      icon={<UtensilsCrossed className="w-4 h-4" />}
                      onClick={handleAudit}
                    >
                      Audit Sanitation
                    </Button>
                    <Button
                      variant="outline"
                      size="md"
                      onClick={handleReset}
                      disabled={loading}
                      icon={<RotateCcw className="w-4 h-4" />}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Audit Result Display */}
          <div className="lg:col-span-7">
            {result ? (
              <div className="space-y-4">
                <Card
                  title="Sanitation & Safety Report"
                  subtitle={`Analyzed ${result.frames_analyzed} frame(s) from submitted ${result.media_type}`}
                  action={
                    <Badge variant={result.overall_score >= 80 ? 'success' : 'warning'} size="md">
                      Rating: {result.cleanliness_rating}
                    </Badge>
                  }
                >
                  {/* Scores Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
                    <div className="p-3.5 rounded-xl bg-background border border-border text-center">
                      <p className="text-[10px] text-secondaryText uppercase font-bold tracking-wider">Overall Score</p>
                      <p className="font-heading font-extrabold text-2xl text-primary mt-0.5">
                        {Math.round(result.overall_score)}<span className="text-xs font-normal text-secondaryText">/100</span>
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-background border border-border text-center">
                      <p className="text-[10px] text-secondaryText uppercase font-bold tracking-wider">Contamination Risk</p>
                      <p className="font-heading font-extrabold text-lg text-coral mt-1">
                        {result.contamination_risk}
                      </p>
                    </div>

                    <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-background border border-border text-center">
                      <p className="text-[10px] text-secondaryText uppercase font-bold tracking-wider">Observed Frames</p>
                      <p className="font-heading font-extrabold text-2xl text-secondary mt-0.5">
                        {result.frames_analyzed}
                      </p>
                    </div>
                  </div>

                  {/* Cross-contamination & Surface Status */}
                  <div className="space-y-3 pt-2">
                    <h4 className="font-heading font-semibold text-xs uppercase tracking-wider text-secondaryText">
                      Cross-Contamination & Surface Analysis
                    </h4>
                    {result.cross_contamination_risks.length > 0 ? (
                      <div className="space-y-2">
                        {result.cross_contamination_risks.map((risk, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 p-3 rounded-lg bg-warning-light/60 border border-warning/30 text-xs text-mainText">
                            <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                            <span>{risk}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-success p-2.5 bg-success-light/50 rounded-lg border border-success/20 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> No cross-contamination hazards identified in visible workspace.
                      </p>
                    )}
                  </div>

                  {/* Detected Hazards with Timestamps */}
                  {result.detected_hazards && result.detected_hazards.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-border">
                      <h4 className="font-heading font-semibold text-xs uppercase tracking-wider text-secondaryText mb-2">
                        Observed Anomalies
                      </h4>
                      <div className="space-y-2">
                        {result.detected_hazards.map((h, i) => (
                          <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-surface border border-border text-xs">
                            <span className="font-medium text-mainText">{h.hazard}</span>
                            <div className="flex items-center gap-2">
                              {h.timestamp && <span className="text-[10px] bg-gray-100 text-secondaryText px-1.5 py-0.5 rounded">{h.timestamp}</span>}
                              {h.severity && <Badge variant={h.severity.toLowerCase() === 'critical' ? 'error' : 'warning'} size="sm">{h.severity}</Badge>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Corrective Action Checklist */}
                  {result.corrective_actions && result.corrective_actions.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-border space-y-2">
                      <h4 className="font-heading font-semibold text-xs uppercase tracking-wider text-secondaryText flex items-center gap-1.5">
                        <ListChecks className="w-4 h-4 text-primary" /> Recommended Corrective Actions
                      </h4>
                      <div className="space-y-2">
                        {result.corrective_actions.map((action, i) => (
                          <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-background border border-border text-xs text-mainText">
                            <FileCheck2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <span>{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Official Disclaimer */}
                  <div className="mt-4 p-3 rounded-lg bg-surface border border-border text-[11px] text-secondaryText">
                    <span className="font-semibold text-mainText">Audit Scope Notice: </span>
                    {result.disclaimer}
                  </div>
                </Card>
              </div>
            ) : (
              <Card className="min-h-[380px] flex flex-col items-center justify-center text-center p-8">
                <div className="w-14 h-14 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center mb-4">
                  <UtensilsCrossed className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="font-heading font-semibold text-base text-mainText mb-1">
                  Ready for Hygiene Audit
                </h3>
                <p className="text-xs sm:text-sm text-secondaryText max-w-sm">
                  Upload an image of your food prep surface or a short video walk-around to inspect cutting board separation, chemical storage, and sanitation protocols.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
