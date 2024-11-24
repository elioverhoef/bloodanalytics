import { useState } from 'react';
import { DataImport } from '@/components/DataImport';
import { VariableManager } from '@/components/VariableManager';
import type { HealthData, Variable, Correlation } from '@/types/health';
import { calculateCorrelation, calculatePValue } from '@/lib/utils/statistics';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function App() {
  const [data, setData] = useState<HealthData[]>([]);
  const [variables, setVariables] = useState<Variable[]>([]);
  const [correlations, setCorrelations] = useState<Correlation[]>([]);
  const [selectedEndDate, setSelectedEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const handleDataImport = (newData: HealthData[]) => {
    setData(newData);
    calculateCorrelations(newData);
  };

  const handleAddVariable = (variable: Variable) => {
    setVariables([...variables, variable]);
  };

  const calculateCorrelations = (healthData: HealthData[]) => {
    const filteredData = healthData.filter(
      d => new Date(d.date) <= new Date(selectedEndDate)
    );
    
    const results: Correlation[] = [];
    variables.forEach((var1, i) => {
      variables.forEach((var2, j) => {
        if (i < j && var1.active && var2.active) {
          const values1 = filteredData
            .map(d => Number(d[var1.name]))
            .filter(v => !isNaN(v));
          const values2 = filteredData
            .map(d => Number(d[var2.name]))
            .filter(v => !isNaN(v));
          
          if (values1.length > 2 && values2.length > 2) {
            const correlation = calculateCorrelation(values1, values2);
            const pValue = calculatePValue(correlation, values1.length);
            
            if (pValue < 0.05) {
              results.push({
                variable1: var1.name,
                variable2: var2.name,
                correlation,
                pValue
              });
            }
          }
        }
      });
    });

    setCorrelations(
      results.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Personal Health Analytics Platform
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <DataImport onDataImport={handleDataImport} />
          <VariableManager onAddVariable={handleAddVariable} />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full md:w-1/3">
                <Label>End Date</Label>
                <Input 
                  type="date"
                  value={selectedEndDate}
                  onChange={e => {
                    setSelectedEndDate(e.target.value);
                    calculateCorrelations(data);
                  }}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Significant Correlations (p lt 0.05)</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Variable 1</TableHead>
                      <TableHead>Variable 2</TableHead>
                      <TableHead>Correlation</TableHead>
                      <TableHead>p-value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {correlations.map((corr, index) => (
                      <TableRow key={index}>
                        <TableCell>{corr.variable1}</TableCell>
                        <TableCell>{corr.variable2}</TableCell>
                        <TableCell>{corr.correlation.toFixed(3)}</TableCell>
                        <TableCell>{corr.pValue.toFixed(3)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>

          {correlations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Correlation Visualization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey={correlations[0]?.variable1} 
                        stroke="#8884d8" 
                      />
                      <Line 
                        type="monotone" 
                        dataKey={correlations[0]?.variable2} 
                        stroke="#82ca9d" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;