import React, { useState, useRef } from 'react';
import {
  Upload,
  Scan,
  X,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  PieChart as PieChartIcon,
  ShieldCheck,
  Bookmark
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { api } from '../services/api';
import { FoodAnalysis } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';

export const FoodScannerPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [customName, setCustomName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FoodAnalysis | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPEG, PNG, WebP).');
      return;
    }
    setError(null);
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setResult(null);
    setSaveSuccess(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setCustomName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select or upload a food image first.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    if (customName.trim()) {
      formData.append('custom_name', customName.trim());
    }

    try {
      const data = await api.analyzeFood(formData);
      setResult(data);
      setSaveSuccess(true);
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Failed to analyze food image. Please check your image or provider connection.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Macro pie chart colors
  const macroData = result
    ? [
        { name: 'Protein', value: Math.max(1, Math.round(result.protein)), color: '#8375D1' },
        { name: 'Carbs', value: Math.max(1, Math.round(result.carbs)), color: '#F07868' },
        { name: 'Fat', value: Math.max(1, Math.round(result.fat)), color: '#5546A6' },
      ]
    : [];

  return (
    <DashboardLayout
      title="Food Scanner & Nutrition"
      description="Upload a photo to automatically identify dishes, estimate portion sizes, and calculate macronutrients."
    >
      <div className="space-y-6">
        {/* Safety Limitation Notice */}
        <Alert variant="info" title="Nutritional Notice & Limitation">
          Nutritional figures are derived from computer vision visual estimates calibrated with USDA reference composite data. Portions, cooking oils, and hidden sodium may differ from prepared food. Do not use for medical insulin dosage or clinical treatments.
        </Alert>

        {error && (
          <Alert variant="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Image Upload & Preview Workspace */}
          <div className="lg:col-span-5 space-y-4">
            <Card title="Image Upload">
              {!previewUrl ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[260px] ${
                    isDragOver
                      ? 'border-primary bg-primary-light/40'
                      : 'border-border bg-background hover:bg-white hover:border-primary/50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileSelect(e.target.files[0]);
                      }
                    }}
                  />
                  <div className="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h4 className="font-heading font-semibold text-sm text-mainText mb-1">
                    Drag and drop your food photo
                  </h4>
                  <p className="text-xs text-secondaryText max-w-xs mb-3">
                    Supports high-resolution JPEG, PNG, and WebP (up to 25MB)
                  </p>
                  <Button variant="outline" size="sm">
                    Select File
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden border border-border bg-black/5 aspect-video flex items-center justify-center">
                    <img
                      src={previewUrl}
                      alt="Food to analyze"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={handleReset}
                      className="absolute top-3 right-3 bg-darkNav/80 hover:bg-darkNav text-white p-1.5 rounded-lg backdrop-blur-sm transition-colors"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <Input
                    label="Optional Dish Name Hint"
                    placeholder="e.g. Avocado Toast with Poached Egg"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    helperText="Help the model calibrate if the dish has unusual preparation."
                  />

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="primary"
                      size="md"
                      className="flex-1"
                      loading={loading}
                      icon={<Scan className="w-4 h-4" />}
                      onClick={handleAnalyze}
                    >
                      Analyze Meal
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

          {/* Right Column: Analysis Results Panel */}
          <div className="lg:col-span-7">
            {result ? (
              <div className="space-y-4">
                <Card
                  title={result.food_name}
                  subtitle={`${result.category} • Serving: ${result.serving_size}`}
                  action={
                    <div className="flex items-center gap-2">
                      <Badge variant="primary" size="md">
                        {Math.round(result.confidence * 100)}% Confidence
                      </Badge>
                      {saveSuccess && (
                        <Badge variant="success" size="md">
                          <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" />
                          Saved to History
                        </Badge>
                      )}
                    </div>
                  }
                >
                  {/* Calorie & Macro Highlights */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
                    <div className="p-3 rounded-xl bg-primary-light/50 border border-primary/15 text-center">
                      <p className="text-[10px] text-secondaryText uppercase font-bold tracking-wider">Calories</p>
                      <p className="font-heading font-extrabold text-2xl text-primary mt-0.5">
                        {Math.round(result.calories)}
                      </p>
                      <p className="text-[11px] text-secondaryText">kcal</p>
                    </div>

                    <div className="p-3 rounded-xl bg-purple-50 border border-purple-100 text-center">
                      <p className="text-[10px] text-secondaryText uppercase font-bold tracking-wider">Protein</p>
                      <p className="font-heading font-extrabold text-2xl text-secondary mt-0.5">
                        {result.protein.toFixed(1)}
                      </p>
                      <p className="text-[11px] text-secondaryText">grams</p>
                    </div>

                    <div className="p-3 rounded-xl bg-coral-light/60 border border-coral/15 text-center">
                      <p className="text-[10px] text-secondaryText uppercase font-bold tracking-wider">Carbs</p>
                      <p className="font-heading font-extrabold text-2xl text-coral mt-0.5">
                        {result.carbs.toFixed(1)}
                      </p>
                      <p className="text-[11px] text-secondaryText">grams</p>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
                      <p className="text-[10px] text-secondaryText uppercase font-bold tracking-wider">Fats</p>
                      <p className="font-heading font-extrabold text-2xl text-success mt-0.5">
                        {result.fat.toFixed(1)}
                      </p>
                      <p className="text-[11px] text-secondaryText">grams</p>
                    </div>
                  </div>

                  {/* Macro Chart & Detailed Micronutrients */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-2 border-t border-border">
                    <div className="sm:col-span-5 flex flex-col items-center justify-center p-3 bg-background rounded-xl border border-border">
                      <p className="text-xs font-semibold text-secondaryText mb-1 flex items-center gap-1.5">
                        <PieChartIcon className="w-3.5 h-3.5 text-primary" /> Macro Ratio
                      </p>
                      <div className="h-36 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={macroData}
                              cx="50%"
                              cy="50%"
                              innerRadius={32}
                              outerRadius={50}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {macroData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex gap-3 text-[11px] text-secondaryText">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-secondary"></span>P</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-coral"></span>C</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary"></span>F</span>
                      </div>
                    </div>

                    <div className="sm:col-span-7 space-y-2 text-xs">
                      <div className="flex justify-between py-1.5 border-b border-border">
                        <span className="text-secondaryText">Dietary Fiber</span>
                        <span className="font-semibold text-mainText">{result.fiber.toFixed(1)}g</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-border">
                        <span className="text-secondaryText">Sugar</span>
                        <span className="font-semibold text-mainText">{result.sugar.toFixed(1)}g</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-border">
                        <span className="text-secondaryText">Sodium</span>
                        <span className="font-semibold text-mainText">{result.sodium_mg.toFixed(0)}mg</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-border">
                        <span className="text-secondaryText">Health Score</span>
                        <span className="font-semibold text-primary">{result.health_score}/100</span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-secondaryText">Dietary Tags</span>
                        <span className="font-medium text-mainText">
                          {result.dietary_attributes?.length > 0 ? result.dietary_attributes.join(', ') : 'Standard'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Micronutrients if present */}
                  {result.micronutrients && Object.keys(result.micronutrients).length > 0 && (
                    <div className="mt-4 pt-3 border-t border-border">
                      <p className="text-xs font-semibold text-secondaryText mb-2">Key Micronutrients & Vitamins</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {Object.entries(result.micronutrients).map(([k, v]) => (
                          <div key={k} className="p-2 rounded-lg bg-background border border-border text-[11px]">
                            <span className="text-secondaryText capitalize">{k.replace(/_/g, ' ')}: </span>
                            <span className="font-semibold text-mainText">{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Analysis Notes */}
                  {result.notes && (
                    <div className="mt-4 p-3 rounded-lg bg-surface border border-border/80 text-xs text-secondaryText">
                      <span className="font-semibold text-mainText">Analysis Note: </span>
                      {result.notes}
                    </div>
                  )}
                </Card>
              </div>
            ) : (
              <Card className="min-h-[380px] flex flex-col items-center justify-center text-center p-8">
                <div className="w-14 h-14 rounded-2xl bg-primary-light text-primary flex items-center justify-center mb-4">
                  <Scan className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-base text-mainText mb-1">
                  Ready to Analyze
                </h3>
                <p className="text-xs sm:text-sm text-secondaryText max-w-sm">
                  Upload an image of your breakfast, lunch, or dinner on the left to view comprehensive caloric breakdown and USDA calibrated macros.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
