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

const UNIT_OPTIONS = [
  { value: 'num', label: 'Number of atoms' },
  { value: 'Bq', label: 'Becquerel (Bq)' },
  { value: 'kBq', label: 'Kilobecquerel (kBq)' },
  { value: 'Ci', label: 'Curie (Ci)' },
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

  const generateEvolution = () => {
    if (!nuclides.some(n => n.isotope && n.quantity)) {
      return;
    }
    setShowEvolution(true);
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
      const node = chainData.nodes[Object.keys(chainData.nodes).find(key => {
        const pos = chainData.nodes[key].position;
        if (!pos) return false;
        
        const dx = pos.x - x;
        const dy = pos.y - y;
        return Math.sqrt(dx * dx + dy * dy) < 30;
      })];
  
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
  
      const response = await fetch('http://localhost:8000/api/decay-chain', {
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
                  <div className="h-64 bg-gray-100 flex items-center justify-center">
                    Time evolution graph will appear here
                  </div>
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