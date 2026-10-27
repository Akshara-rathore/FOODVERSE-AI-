import React, { useState, useRef } from 'react';
import {
  ShieldCheck,
  Upload,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Layers,
  Thermometer,
  X
} from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { api } from '../services/api';
import { FreshnessAnalysis } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';

export const FreshnessCheckerPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [foodType, setFoodType] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FreshnessAnalysis | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      return;
    }
    setError(null);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setFoodType('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select an image of the food item to inspect.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    if (foodType.trim()) {
      formData.append('food_type', foodType.trim());
    }

    try {
      const data = await api.analyzeFreshness(formData);
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Freshness evaluation failed. Please verify provider connectivity.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'fresh':
        return <Badge variant="success" size="md">Fresh & Optimal</Badge>;
      case 'consume soon':
        return <Badge variant="warning" size="md">Consume Promptly</Badge>;
      default:
        return <Badge variant="error" size="md">Spoiled / Do Not Consume</Badge>;
    }
  };

  return (
    <DashboardLayout
      title="Freshness Checker"
      description="Computer vision assessment of visual decay, enzymatic browning, surface oxidation, and shelf-life."
    >
      <div className="space-y-6">
        {/* Critical Food Safety Notice Banner */}
        <Alert
          variant="coral"
          title="Essential Food Safety Limitation"
        >
          Visual examination is an optical estimate of surface condition. It CANNOT detect odorless, tasteless pathogenic bacteria (such as Salmonella, Listeria, E. coli) or microbial toxins. Always follow official storage temperatures and discard food with off odors, slime, or unknown temperature history.
        </Alert>

        {error && (
          <Alert variant="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Upload Card */}
          <div className="lg:col-span-5 space-y-4">
            <Card title="Inspect Food Item">
              {!previewUrl ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer bg-background hover:bg-white hover:border-coral/50 transition-all flex flex-col items-center justify-center min-h-[260px]"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFile(e.target.files[0]);
                      }
                    }}
                  />
                  <div className="w-12 h-12 rounded-xl bg-coral-light text-coral flex items-center justify-center mb-3">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h4 className="font-heading font-semibold text-sm text-mainText mb-1">
                    Upload item photo for freshness check
                  </h4>
                  <p className="text-xs text-secondaryText max-w-xs mb-3">
                    Fruits, vegetables, prepared produce, or proteins
                  </p>
                  <Button variant="outline" size="sm">
                    Select Photo
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden border border-border aspect-video">
                    <img src={previewUrl} alt="Inspection item" className="w-full h-full object-cover" />
                    <button
                      onClick={handleReset}
                      className="absolute top-3 right-3 bg-darkNav/80 text-white p-1.5 rounded-lg backdrop-blur-sm"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <Input
                    label="Food Item Type"
                    placeholder="e.g. Fresh Strawberries, Avocados, Salmon Fillet"
                    value={foodType}
                    onChange={(e) => setFoodType(e.target.value)}
                    helperText="Providing the food category helps the vision model apply exact ripening models."
                  />

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="coral"
                      size="md"
                      className="flex-1"
                      loading={loading}
                      icon={<ShieldCheck className="w-4 h-4" />}
                      onClick={handleAnalyze}
                    >
                      Evaluate Freshness
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

          {/* Result Card */}
          <div className="lg:col-span-7">
            {result ? (
              <div className="space-y-4">
                <Card
                  title={result.food_item}
                  subtitle="Optical Freshness & Ripeness Report"
                  action={getStatusBadge(result.status)}
                >
                  {/* Freshness Score Metric */}
                  <div className="p-4 rounded-xl bg-background border border-border my-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-secondaryText font-medium">Freshness Index</p>
                      <p className="font-heading font-extrabold text-3xl text-mainText mt-0.5">
                        {Math.round(result.freshness_score)}<span className="text-sm font-normal text-secondaryText">/100</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-secondaryText font-medium">Estimated Window</p>
                      <p className="font-heading font-bold text-lg text-primary flex items-center gap-1.5 justify-end mt-0.5">
                        <Calendar className="w-4 h-4 text-coral" />
                        ~{result.shelf_life_days} Days Remaining
                      </p>
                    </div>
                  </div>

                  {/* Observed Visual Indicators */}
                  <div className="space-y-3 pt-2">
                    <h4 className="font-heading font-semibold text-xs uppercase tracking-wider text-secondaryText">
                      Observed Visual Indicators
                    </h4>
                    <div className="space-y-2">
                      {result.visual_indicators.map((indicator, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-surface border border-border text-xs text-mainText">
                          <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                          <span>{indicator}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Texture Observations & Color Metrics */}
                  {result.texture_observations && (
                    <div className="mt-4 pt-3 border-t border-border text-xs">
                      <h4 className="font-heading font-semibold text-xs uppercase tracking-wider text-secondaryText mb-1.5">
                        Texture & Surface Integrity
                      </h4>
                      <p className="text-mainText leading-relaxed p-3 bg-background rounded-lg border border-border">
                        {result.texture_observations}
                      </p>
                    </div>
                  )}

                  {/* Storage Recommendation */}
                  {result.storage_recommendation && (
                    <div className="mt-4 p-3.5 rounded-xl bg-primary-light/50 border border-primary/20 text-xs space-y-1">
                      <p className="font-heading font-bold text-primary flex items-center gap-1.5">
                        <Thermometer className="w-4 h-4 text-coral" /> Recommended Storage
                      </p>
                      <p className="text-mainText">{result.storage_recommendation}</p>
                    </div>
                  )}

                  {/* Safety Disclaimer Banner on Record */}
                  <div className="mt-4 p-3 rounded-lg bg-coral-light/60 border border-coral/20 text-[11px] text-mainText leading-relaxed">
                    <span className="font-bold text-coral">Disclaimers & Limits: </span>
                    {result.safety_disclaimer}
                  </div>
                </Card>
              </div>
            ) : (
              <Card className="min-h-[380px] flex flex-col items-center justify-center text-center p-8">
                <div className="w-14 h-14 rounded-2xl bg-coral-light text-coral flex items-center justify-center mb-4">
                  <ShieldCheck className="w-7 h-7 text-coral" />
                </div>
                <h3 className="font-heading font-semibold text-base text-mainText mb-1">
                  Freshness Inspection Ready
                </h3>
                <p className="text-xs sm:text-sm text-secondaryText max-w-sm">
                  Upload an item photo to inspect signs of moisture loss, mold onset, oxidation, and recommended temperature zones.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
