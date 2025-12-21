import React from 'react';
import { Trash2, Plus, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { DailyStat } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '../lib/utils';

interface DataEditorProps {
  data: DailyStat[];
  onUpdate: (index: number, field: 'newFollowers' | 'unfollows', newValue: number) => void;
  onAddDay: () => void;
  onDelete: (index: number) => void;
  dateRange?: DateRange;
}

export const DataEditor: React.FC<DataEditorProps> = ({ data, onUpdate, onAddDay, onDelete, dateRange }) => {
  const isFiltered = dateRange?.from !== undefined;
  
  return (
    <Card className="h-[500px] lg:h-[600px] flex flex-col">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-4 flex-none">
        <CardTitle>Daily Data</CardTitle>
        <Button 
          onClick={onAddDay} 
          size="sm" 
          variant="outline" 
          className="h-8"
          disabled={isFiltered}
          title={isFiltered ? "Clear date filter to add days" : "Add a new day"}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Day
        </Button>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-black border-b border-white/10 z-10">
              <tr className="text-white/60 text-xs uppercase">
                <th className="px-4 py-3 text-left min-w-[120px]">Date</th>
                <th className="px-2 py-3 text-right text-green-400">New</th>
                <th className="px-2 py-3 text-right text-red-400">Lost</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-2 py-3 w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.map((day, index) => (
                <tr key={`${day.date}-${index}`} className="hover:bg-white/5 group">
                  <td className="px-4 py-2 text-xs text-white/80 whitespace-nowrap">
                    {format(new Date(day.date), 'yyyy-MM-dd')}
                  </td>
                  <td className="px-2 py-2 text-right">
                    <input
                      type="number"
                      min="0"
                      className="w-16 bg-white/5 border border-white/10 rounded px-2 py-1 text-right text-green-400 focus:outline-none focus:border-white/40 transition-colors"
                      value={day.newFollowers}
                      onChange={(e) => onUpdate(index, 'newFollowers', parseInt(e.target.value) || 0)}
                    />
                  </td>
                  <td className="px-2 py-2 text-right">
                    <input
                      type="number"
                      min="0"
                      className="w-16 bg-white/5 border border-white/10 rounded px-2 py-1 text-right text-red-400 focus:outline-none focus:border-white/40 transition-colors"
                      value={day.unfollows}
                      onChange={(e) => onUpdate(index, 'unfollows', parseInt(e.target.value) || 0)}
                    />
                  </td>
                  <td className="px-4 py-2 text-right text-white/60 font-mono text-xs">
                    {day.totalFollowers?.toLocaleString()}
                  </td>
                  <td className="px-2 py-2 text-center">
                    <button
                      onClick={() => onDelete(index)}
                      className="text-white/40 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-1"
                      title="Delete row"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex-none px-6 py-3 border-t border-white/10 text-xs text-white/40 flex justify-between bg-black">
          <span>{data.length} days</span>
          <span>Avg Lost: {Math.round(data.reduce((acc, d) => acc + d.unfollows, 0) / (data.length || 1))}</span>
        </div>
      </CardContent>
    </Card>
  );
};
