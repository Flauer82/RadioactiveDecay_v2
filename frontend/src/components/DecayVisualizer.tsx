// src/components/DecayVisualizer.tsx
"use client";

import React, { useState, useRef } from 'react';
import { PlusCircle, MinusCircle, RotateCcw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
    SelectLabel
  } from "@/components/ui/select";

interface NuclideEntry {
  isotope: string;
  quantity: string;
  unit: string;
}

interface ChainData {
  image: string;
  nodes: {
    [key: string]: {
      position: { x: number; y: number };
      data: NodeData;
    };
  };
  metadata: {
    width: number;
    height: number;
  };
}

interface NodeData {
  name: string;
  half_life: string;
  mass_number: number;
  atomic_number: number;
  atomic_mass: number;
  decay_modes?: string[];
  branching_fractions?: number[];
}

interface EvolutionData {
    image: string;
    plot_data: {
      time: number[];
      decay: Record<string, number[]>;
    };
    metadata: {
      time_unit: string;
      y_unit: string;
      nuclides: string[];
    };
  }

const TIME_UNIT_OPTIONS = [
  { value: 's', label: 'Seconds' },
  { value: 'm', label: 'Minutes' },
  { value: 'h', label: 'Hours' },
  { value: 'd', label: 'Days' },
  { value: 'y', label: 'Years' }
];

const Y_AXIS_UNIT_OPTIONS = [
  // Activity units
  { value: 'Bq', label: 'Becquerel (Bq)', category: 'Activity' },
  { value: 'kBq', label: 'Kilobecquerel (kBq)', category: 'Activity' },
  { value: 'MBq', label: 'Megabecquerel (MBq)', category: 'Activity' },
  { value: 'GBq', label: 'Gigabecquerel (GBq)', category: 'Activity' },
  { value: 'Ci', label: 'Curie (Ci)', category: 'Activity' },
  { value: 'mCi', label: 'Millicurie (mCi)', category: 'Activity' },
  { value: 'µCi', label: 'Microcurie (µCi)', category: 'Activity' },
  // Mass and amount units
  { value: 'g', label: 'Grams (g)', category: 'Mass' },
  { value: 'mol', label: 'Moles (mol)', category: 'Amount' },
  { value: 'num', label: 'Number of atoms', category: 'Amount' },
  // Fraction units
  { value: 'activity_frac', label: 'Activity fraction', category: 'Fraction' },
  { value: 'mass_frac', label: 'Mass fraction', category: 'Fraction' },
  { value: 'mol_frac', label: 'Mole fraction', category: 'Fraction' }
];

const UNIT_OPTIONS = [
  { value: 'num', label: 'Number of atoms' },
  { value: 'g', label: 'Grams (g)' },
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'mol', label: 'Moles (mol)' },
  { value: 'kmol', label: 'Kilomoles (kmol)' }
];

const DecayChainTooltip: React.FC<{ data: NodeData }> = ({ data }) => {
  if (!data) return null;
  
  return (
    <div className="p-2 max-w-xs">
      <h4 className="font-semibold text-lg">{data.name}</h4>
      <div className="text-sm space-y-1">
        <p>Half-life: {data.half_life}</p>
        <p>Mass number: {data.mass_number}</p>
        <p>Atomic number: {data.atomic_number}</p>
        <p>Atomic mass: {data.atomic_mass}</p>
        {data.decay_modes && (
          <div>
            <p className="font-medium">Decay modes:</p>
            <ul className="list-disc pl-4">
              {data.decay_modes.map((mode, idx) => (
                <li key={idx}>
                  {mode} ({data.branching_fractions?.[idx]}%)
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const DecayVisualizer: React.FC = () => {
  const [nuclides, setNuclides] = useState<NuclideEntry[]>([{ isotope: '', quantity: '', unit: 'Bq' }]);
  const [showChain, setShowChain] = useState(false);
  const [showEvolution, setShowEvolution] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chainData, setChainData] = useState<ChainData | null>(null);
  const [hoveredNode, setHoveredNode] = useState<NodeData | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [evolutionData, setEvolutionData] = useState<EvolutionData | null>(null);
  const [timeUnit, setTimeUnit] = useState('d');
  const [yAxisUnit, setYAxisUnit] = useState('Bq');
  const [timeValue, setTimeValue] = useState('1000');
  const [evolutionLoading, setEvolutionLoading] = useState(false);
  const [evolutionError, setEvolutionError] = useState<string | null>(null);

  const addNuclide = () => {
    setNuclides([...nuclides, { isotope: '', quantity: '', unit: 'Bq' }]);
  };

  const removeNuclide = (index: number) => {
    const newNuclides = nuclides.filter((_, i) => i !== index);
    setNuclides(newNuclides);
  };

  const updateNuclide = (index: number, field: keyof NuclideEntry, value: string) => {
    const updatedNuclides = nuclides.map((nuclide, i) => {
      if (i === index) {
        return { ...nuclide, [field]: value };
      }
      return nuclide;
    });
    setNuclides(updatedNuclides);
  };

  const resetForm = () => {
    setNuclides([{ isotope: '', quantity: '', unit: 'Bq' }]);
    setShowChain(false);
    setShowEvolution(false);
    setChainData(null);
    setError(null);
  };

  const generateEvolution = async () => {
    const validNuclides = nuclides.filter(n => n.isotope && n.quantity);
    if (!validNuclides.length) {
      setEvolutionError("Please enter at least one nuclide with quantity");
      return;
    }

    try {
      setEvolutionLoading(true);
      setEvolutionError(null);
      setShowEvolution(true);

      const response = await fetch('/rad_decay/api/evolution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nuclides: validNuclides,
          time_period: parseFloat(timeValue),
          time_unit: timeUnit,
          y_unit: yAxisUnit
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setEvolutionData(data);
        setEvolutionError(null);
      } else {
        const error = await response.json();
        setEvolutionError(error.detail || 'Failed to generate evolution plot');
      }
    } catch (err) {
      console.error('Error generating evolution plot:', err);
      setEvolutionError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setEvolutionLoading(false);
    }
  };

  const renderEvolutionControls = () => {
    return (
      <div className="mt-4 p-4 border rounded-lg bg-gray-50">
        <h4 className="font-medium mb-3">Time Evolution Settings</h4>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              Time Period
            </label>
            <input
              type="text"
              value={timeValue}
              onChange={(e) => setTimeValue(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter time period"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              Time Unit
            </label>
            <Select
              value={timeUnit}
              onValueChange={setTimeUnit}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_UNIT_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              Y-Axis Unit
            </label>
            <Select
              value={yAxisUnit}
              onValueChange={setYAxisUnit}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Activity</SelectLabel>
                  {Y_AXIS_UNIT_OPTIONS.filter(opt => opt.category === 'Activity').map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Mass and Amount</SelectLabel>
                  {Y_AXIS_UNIT_OPTIONS.filter(opt => ['Mass', 'Amount'].includes(opt.category)).map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Fractions</SelectLabel>
                  {Y_AXIS_UNIT_OPTIONS.filter(opt => opt.category === 'Fraction').map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    );
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!chainData?.metadata?.width || !chainData?.metadata?.height || !containerRef.current) {
      return;
    }
  
    try {
      const rect = containerRef.current.getBoundingClientRect();
      
      // Ensure we have valid dimensions
      if (rect.width === 0 || rect.height === 0) {
        return;
      }
  
      // Calculate positions with safety checks
      const x = (e.clientX - rect.left) / rect.width * chainData.metadata.width;
      const y = (e.clientY - rect.top) / rect.height * chainData.metadata.height;
  
      // Find the closest node
      const nodeKey = Object.keys(chainData?.nodes || {}).find(key => {
        const pos = chainData?.nodes?.[key]?.position;
        if (!pos) return false;
        
        const dx = pos.x - x;
        const dy = pos.y - y;
        return Math.sqrt(dx * dx + dy * dy) < 30;
      });
      const node = nodeKey ? chainData?.nodes?.[nodeKey] : undefined;
  
      if (node?.data) {
        setHoveredNode(node.data);
        setTooltipPosition({ x: e.clientX, y: e.clientY });
      } else {
        setHoveredNode(null);
      }
    } catch (error) {
      console.error('Error in handleMouseMove:', error);
      setHoveredNode(null);
    }
  };
  
  // Add debug logging to verify data
  const generateDecayChain = async () => {
    if (!nuclides[0].isotope) {
      return;
    }
  
    try {
      setLoading(true);
      setError(null);
      setShowChain(true);
  
      const response = await fetch('/rad_decay/api/decay-chain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isotope: nuclides[0].isotope }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to generate decay chain');
      }
  
      // Verify the data structure
      console.log('Received chain data:', data);
  
      if (!data.metadata?.width || !data.metadata?.height) {
        throw new Error('Invalid data structure received from server');
      }
  
      setChainData(data);
    } catch (err) {
      console.error('Error generating decay chain:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Radioactive Decay Visualizer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Nuclide Input Section */}
            <div className="space-y-4">
              {nuclides.map((nuclide, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Enter isotope (e.g., U-238)"
                      value={nuclide.isotope}
                      onChange={(e) => updateNuclide(index, 'isotope', e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Quantity"
                      value={nuclide.quantity}
                      onChange={(e) => updateNuclide(index, 'quantity', e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <select
                      value={nuclide.unit}
                      onChange={(e) => updateNuclide(index, 'unit', e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      {UNIT_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {index > 0 && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeNuclide(index)}
                    >
                      <MinusCircle className="h-5 w-5 text-red-500" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 flex-wrap">
              <Button onClick={addNuclide} variant="outline" className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Add Nuclide
              </Button>
              <Button onClick={resetForm} variant="outline" className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
              <Button onClick={generateDecayChain} variant="default">
                Generate Decay Chain
              </Button>
              <Button onClick={generateEvolution} variant="secondary">
                Show Decay Evolution
              </Button>
            </div>

            {/* Evolution Controls */}
            {showEvolution && renderEvolutionControls()}

            {/* Usage Tips */}
            <Alert>
              <AlertDescription>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Enter isotopes in the format 'Element-Mass' (e.g., U-238, Th-232)</li>
                  <li>For decay chain visualization, only the first isotope will be used</li>
                  <li>For evolution graph, all specified isotopes will form an inventory</li>
                  <li>You can mix different units when specifying quantities</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>

          {/* Visualization outputs */}
          {(showChain || showEvolution) && (
            <div className="mt-8 space-y-8">
              {showChain && (
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Decay Chain for {nuclides[0].isotope}
                  </h3>
                  <TooltipProvider>
                    {loading ? (
                      <div className="h-64 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                      </div>
                    ) : error ? (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    ) : chainData && (
                      <div 
                        ref={containerRef}
                        className="relative overflow-hidden rounded-lg"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={() => setHoveredNode(null)}
                      >
                        <img 
                          src={`data:image/png;base64,${chainData.image}`}
                          alt={`Decay chain for ${nuclides[0].isotope}`}
                          className="max-w-full h-auto"
                        />
                        
                        {hoveredNode && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div 
                                style={{
                                  position: 'fixed',
                                  left: tooltipPosition.x,
                                  top: tooltipPosition.y,
                                  pointerEvents: 'none'
                                }}
                              >
                                <TooltipContent>
                                  <DecayChainTooltip data={hoveredNode} />
                                </TooltipContent>
                              </div>
                            </TooltipTrigger>
                          </Tooltip>
                        )}
                      </div>
                    )}
                  </TooltipProvider>
                </div>
              )}
              {showEvolution && (
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Time Evolution</h3>
                  {evolutionLoading ? (
                    <div className="h-64 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                    </div>
                  ) : evolutionError ? (
                    <Alert variant="destructive">
                      <AlertDescription>{evolutionError}</AlertDescription>
                    </Alert>
                  ) : evolutionData ? (
                    <div className="space-y-4">
                      <img
                        src={`data:image/png;base64,${evolutionData.image}`}
                        alt="Decay evolution plot"
                        className="max-w-full h-auto rounded-lg shadow-lg"
                      />
                      <div className="text-sm text-gray-600">
                        <p className="font-medium">Plot Information:</p>
                        <ul className="list-disc pl-4 mt-1">
                          <li>Time Unit: {evolutionData.metadata.time_unit}</li>
                          <li>Y-Axis Unit: {evolutionData.metadata.y_unit}</li>
                          <li>Nuclides: {evolutionData.metadata.nuclides.join(', ')}</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="h-64 bg-gray-100 flex items-center justify-center">
                      Configure time settings and click Generate to view evolution
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DecayVisualizer;