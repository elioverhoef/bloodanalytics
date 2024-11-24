import { Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Variable, VariableType } from '@/types/health';
import { useState } from 'react';

interface VariableManagerProps {
  onAddVariable: (variable: Variable) => void;
}

const variableTypes: VariableType[] = ['blood', 'diet', 'supplement', 'lifestyle', 'sleep', 'exercise'];

export function VariableManager({ onAddVariable }: VariableManagerProps) {
  const [newVariable, setNewVariable] = useState<Variable>({
    name: '',
    type: 'blood',
    unit: '',
    active: true,
    description: '',
    normalRange: { min: 0, max: 0 }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddVariable(newVariable);
    setNewVariable({
      name: '',
      type: 'blood',
      unit: '',
      active: true,
      description: '',
      normalRange: { min: 0, max: 0 }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add New Variable
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input 
              value={newVariable.name}
              onChange={e => setNewVariable({...newVariable, name: e.target.value})}
              className="mt-2"
              required
            />
          </div>
          <div>
            <Label>Type</Label>
            <Select 
              value={newVariable.type}
              onValueChange={value => setNewVariable({...newVariable, type: value as VariableType})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {variableTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Unit</Label>
            <Input 
              value={newVariable.unit}
              onChange={e => setNewVariable({...newVariable, unit: e.target.value})}
              className="mt-2"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea 
              value={newVariable.description}
              onChange={e => setNewVariable({...newVariable, description: e.target.value})}
              className="mt-2"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Normal Range Min</Label>
              <Input 
                type="number"
                value={newVariable.normalRange?.min}
                onChange={e => setNewVariable({
                  ...newVariable, 
                  normalRange: { ...newVariable.normalRange!, min: Number(e.target.value) }
                })}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Normal Range Max</Label>
              <Input 
                type="number"
                value={newVariable.normalRange?.max}
                onChange={e => setNewVariable({
                  ...newVariable, 
                  normalRange: { ...newVariable.normalRange!, max: Number(e.target.value) }
                })}
                className="mt-2"
              />
            </div>
          </div>
          <Button type="submit">Add Variable</Button>
        </form>
      </CardContent>
    </Card>
  );
}