// src/components/DecayVisualizer.tsx
"use client";

import React, { useState } from 'react';
import { PlusCircle, MinusCircle, RotateCcw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

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

const DecayVisualizer = () => {
  const [nuclides, setNuclides] = useState([{ isotope: '', quantity: '', unit: 'Bq' }]);
  const [showChain, setShowChain] = useState(false);
  const [showEvolution, setShowEvolution] = useState(false);

  const addNuclide = () => {
    setNuclides([...nuclides, { isotope: '', quantity: '', unit: 'Bq' }]);
  };

  const removeNuclide = (index: number) => {
    const newNuclides = nuclides.filter((_, i) => i !== index);
    setNuclides(newNuclides);
  };

  const updateNuclide = (index: number, field: string, value: string) => {
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
  };

  const generateDecayChain = () => {
    if (!nuclides[0].isotope) {
      return;
    }
    setShowChain(true);
  };

  const generateEvolution = () => {
    if (!nuclides.some(n => n.isotope && n.quantity)) {
      return;
    }
    setShowEvolution(true);
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

          {/* Placeholder for visualization outputs */}
          {(showChain || showEvolution) && (
            <div className="mt-8 space-y-4">
              {showChain && (
                <div className="border rounded p-4">
                  <h3 className="text-lg font-semibold mb-2">Decay Chain</h3>
                  <div className="h-64 bg-gray-100 flex items-center justify-center">
                    Decay chain visualization will appear here
                  </div>
                </div>
              )}
              
              {showEvolution && (
                <div className="border rounded p-4">
                  <h3 className="text-lg font-semibold mb-2">Time Evolution</h3>
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