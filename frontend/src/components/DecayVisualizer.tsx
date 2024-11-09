// src/components/DecayVisualizer.tsx
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const timeUnits = [
  { value: 's', label: 'Seconds' },
  { value: 'm', label: 'Minutes' },
  { value: 'h', label: 'Hours' },
  { value: 'd', label: 'Days' },
  { value: 'y', label: 'Years' },
  { value: 'ky', label: 'Kiloyears' },
  { value: 'My', label: 'Million years' },
];

export default function DecayVisualizer() {
  const [isotope, setIsotope] = useState('');
  const [timeUnit, setTimeUnit] = useState('y');
  const [timePeriod, setTimePeriod] = useState('100');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [decayChainImage, setDecayChainImage] = useState('');
  const [evolutionImage, setEvolutionImage] = useState('');

  const fetchDecayChain = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/decay-chain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isotope })
      });
      
      if (!response.ok) throw new Error('Invalid isotope');
      const data = await response.json();
      setDecayChainImage(data.image);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvolutionPlot = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/evolution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          isotope,
          time_period: parseFloat(timePeriod),
          time_unit: timeUnit
        })
      });
      
      if (!response.ok) throw new Error('Failed to generate evolution plot');
      const data = await response.json();
      setEvolutionImage(data.image);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchDecayChain();
    await fetchEvolutionPlot();
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Radioactive Decay Visualizer</CardTitle>
          <CardDescription>
            Explore decay chains and time evolution of radioactive isotopes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Enter isotope (e.g., U-238, Th-232)"
                  value={isotope}
                  onChange={(e) => setIsotope(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="w-32">
                <Input
                  type="number"
                  placeholder="Time"
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="w-48">
                <Select value={timeUnit} onValueChange={setTimeUnit}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeUnits.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing</>
                ) : (
                  'Visualize'
                )}
              </Button>
            </div>
          </form>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="chain" className="mt-6">
            <TabsList>
              <TabsTrigger value="chain">Decay Chain</TabsTrigger>
              <TabsTrigger value="evolution">Time Evolution</TabsTrigger>
            </TabsList>
            <TabsContent value="chain" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  {decayChainImage && (
                    <img
                      src={`data:image/png;base64,${decayChainImage}`}
                      alt="Decay chain"
                      className="mx-auto"
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="evolution" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  {evolutionImage && (
                    <img
                      src={`data:image/png;base64,${evolutionImage}`}
                      alt="Time evolution"
                      className="mx-auto"
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}