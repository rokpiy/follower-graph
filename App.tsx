import React, { useState, useRef } from 'react';
import { Upload, TrendingUp, CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { DailyStat, GrowthConfig } from './types';
import { FollowerChart } from './components/FollowerChart';
import { DataEditor } from './components/DataEditor';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Calendar } from './components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './components/ui/popover';
import { cn } from './lib/utils';
import { parseTwitterAnalyticsCSV } from './lib/csvParser';
import { Analytics } from "@vercel/analytics/react"


const INITIAL_CONFIG: GrowthConfig = {
  startDate: '',
  endDate: ''
};

export default function App() {
  const [config, setConfig] = useState<GrowthConfig>(INITIAL_CONFIG);
  const [data, setData] = useState<DailyStat[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const chartData = React.useMemo(() => {
    if (data.length === 0) return [];
    
    let runningTotal = 0;
    const dataWithTotals = data.map((day, index) => {
      if (index === 0) {
        runningTotal = day.newFollowers - day.unfollows;
      } else {
        runningTotal = runningTotal + day.newFollowers - day.unfollows;
      }
      return {
        ...day,
        totalFollowers: runningTotal
      };
    });
    
    const hasStartDate = config.startDate && config.startDate.trim() !== '';
    const hasEndDate = config.endDate && config.endDate.trim() !== '';
    
    if (hasStartDate || hasEndDate) {
      const filtered = dataWithTotals.filter(day => {
        const dayDate = new Date(day.date + 'T00:00:00');
        
        if (hasStartDate) {
          const startDate = new Date(config.startDate! + 'T00:00:00');
          if (dayDate < startDate) return false;
        }
        
        if (hasEndDate) {
          const endDate = new Date(config.endDate! + 'T00:00:00');
          if (dayDate > endDate) return false;
        }
        
        return true;
      });
      
      return filtered;
    }
    
    return dataWithTotals;
  }, [data, config.startDate, config.endDate]);

  const currentTotal = chartData.length > 0 ? chartData[chartData.length - 1].totalFollowers : 0;

  const handleUpdateDay = (index: number, field: 'newFollowers' | 'unfollows', newValue: number) => {
    // chartData의 인덱스를 사용하므로, chartData에서 날짜를 찾아서 원본 data에서 업데이트
    const targetDate = chartData[index]?.date;
    if (!targetDate) return;
    
    const newData = [...data];
    const dataIndex = newData.findIndex(d => d.date === targetDate);
    if (dataIndex !== -1) {
      newData[dataIndex][field] = newValue;
      setData(newData);
    }
  };

  const handleAddDay = () => {
    const lastDate = data.length > 0 ? new Date(data[data.length - 1].date) : new Date();
    lastDate.setDate(lastDate.getDate() + 1);
    const dateStr = lastDate.toISOString().split('T')[0];

    setData([...data, { date: dateStr, newFollowers: 0, unfollows: 0 }]);
  };

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const text = await file.text();
      const parsedData = parseTwitterAnalyticsCSV(text);
      
      if (parsedData.length > 0) {
        setData(parsedData);
      } else {
        alert("Could not parse CSV data. Please check the file format.");
      }
      
      setIsProcessing(false);
    } catch (error) {
      console.error(error);
      alert("Error processing CSV file.");
      setIsProcessing(false);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteDay = (index: number) => {
    // chartData의 인덱스를 사용하므로, chartData에서 날짜를 찾아서 원본 data에서 삭제
    const targetDate = chartData[index]?.date;
    if (!targetDate) return;
    
    const newData = data.filter(d => d.date !== targetDate);
    setData(newData);
  };

  const applyDateFilter = (range: DateRange | undefined) => {
    if (range?.from) {
      setConfig({
        ...config,
        startDate: format(range.from, 'yyyy-MM-dd'),
        endDate: range.to ? format(range.to, 'yyyy-MM-dd') : format(range.from, 'yyyy-MM-dd')
      });
    } else {
      setConfig({
        ...config,
        startDate: '',
        endDate: ''
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {data.length === 0 ? (
        /* Welcome Screen */
        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <CardTitle>Follower Growth Tracker</CardTitle>
              <CardDescription>
                Import your X Analytics data to visualize follower growth
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm text-white/60">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-white text-black flex items-center justify-center text-xs font-bold">1</div>
                  <p>Visit <a href="https://analytics.x.com" target="_blank" rel="noopener noreferrer" className="text-white hover:underline">analytics.x.com</a></p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-white text-black flex items-center justify-center text-xs font-bold">2</div>
                  <p>Select your date range</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-white text-black flex items-center justify-center text-xs font-bold">3</div>
                  <p>Download CSV file</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-white text-black flex items-center justify-center text-xs font-bold">4</div>
                  <p>Import below</p>
                </div>
              </div>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleCSVUpload}
                accept=".csv"
                className="hidden"
              />
              <Button 
                onClick={triggerFileUpload} 
                disabled={isProcessing}
                className="w-full"
              >
                <Upload className="w-4 h-4" />
                {isProcessing ? 'Processing...' : 'Import CSV File'}
              </Button>
              
              <p className="text-xs text-center text-white/40">
                Your data stays private in your browser
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Main Dashboard */
        <div className="min-h-screen p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h1 className="text-3xl font-bold">Follower Growth Tracker</h1>
              
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal h-10 w-[240px] gap-2",
                        !dateRange && "text-white/60"
                      )}
                    >
                      <CalendarIcon className="h-4 w-4 flex-shrink-0" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "MMM dd, yyyy")} -{" "}
                            {format(dateRange.to, "MMM dd, yyyy")}
                          </>
                        ) : (
                          format(dateRange.from, "MMM dd, yyyy")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={(range) => {
                        setDateRange(range);
                        applyDateFilter(range);
                      }}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>

                {dateRange?.from && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => {
                      setDateRange(undefined);
                      applyDateFilter(undefined);
                    }}
                    title="Clear date filter"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleCSVUpload}
                  accept=".csv"
                  className="hidden"
                />
                <Button onClick={triggerFileUpload} disabled={isProcessing} variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Import CSV
                </Button>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-4">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:h-[100px]">
                  <Card className="flex flex-col justify-center">
                    <CardHeader className="pb-1">
                      <CardTitle className="text-sm font-medium text-white/60">Current Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-white">
                        {currentTotal.toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="flex flex-col justify-center">
                    <CardHeader className="pb-1">
                      <CardTitle className="text-sm font-medium text-white/60">Avg Daily Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-green-500">
                          +{chartData.length > 0 ? Math.round(chartData.reduce((a, b) => a + b.newFollowers, 0) / chartData.length) : 0}
                        </span>
                        <span className="text-white/40">/</span>
                        <span className="text-2xl font-bold text-red-500">
                          -{chartData.length > 0 ? Math.round(chartData.reduce((a, b) => a + b.unfollows, 0) / chartData.length) : 0}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="flex flex-col justify-center sm:col-span-2 lg:col-span-1">
                    <CardHeader className="pb-1">
                      <CardTitle className="text-sm font-medium text-white/60">Weekly Growth (AVG)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-emerald-500">
                        {(() => {
                          const weeklyGrowth = chartData.length > 0
                            ? Math.round((chartData.reduce((a, b) => a + (b.newFollowers - b.unfollows), 0) / chartData.length) * 7)
                            : 0;
                          return `${weeklyGrowth > 0 ? '+' : ''}${weeklyGrowth.toLocaleString()}`;
                        })()}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <FollowerChart data={chartData} height="h-[400px] lg:h-[484px]" />
              </div>
              
              {/* Right Column */}
              <div className="lg:col-span-1">
                <DataEditor
                  data={chartData}
                  onUpdate={handleUpdateDay}
                  onAddDay={handleAddDay}
                  onDelete={handleDeleteDay}
                  dateRange={dateRange}
                />
              </div>
            </div>

            {/* Footer */}
            <footer className="mt-12 pb-6 text-center">
              <p className="text-sm text-white/40">
                Made by{' '}
                <a 
                  href="https://x.com/JoshuaIPark" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white transition-colors underline"
                >
                  @JoshuaIPark
                </a>
              </p>
            </footer>
          </div>
        </div>
      )}
      <Analytics />
    </div>
  );
}
