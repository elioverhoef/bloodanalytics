import { Upload, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { HealthData } from '@/types/health';

interface DataImportProps {
  onDataImport: (data: HealthData[]) => void;
}

export function DataImport({ onDataImport }: DataImportProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result as string;
        const rows = text.split('\n');
        const headers = rows[0].split(',');
        
        const processedData = rows.slice(1)
          .filter(row => row.trim())
          .map(row => {
            const values = row.split(',');
            const rowData: HealthData = { date: '' };
            headers.forEach((header, index) => {
              const value = values[index]?.trim();
              rowData[header.trim()] = isNaN(Number(value)) ? value : Number(value);
            });
            return rowData;
          });
        
        onDataImport(processedData);
      };
      reader.readAsText(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Data Import
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>Import CSV Data</Label>
            <Input 
              type="file" 
              accept=".csv" 
              onChange={handleFileUpload}
              className="mt-2"
            />
          </div>
          <Alert variant="info" className="bg-blue-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              CSV should have a date column and values for each variable
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
}