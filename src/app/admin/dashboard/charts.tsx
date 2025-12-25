'use client';

import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { AdminConceptDifficulty, AdminTrend } from '@/types';

const chartConfigDifficulty: ChartConfig = {
  difficulty: {
    label: 'Difficulty',
    color: 'hsl(var(--primary))',
  },
};

const chartConfigTrends: ChartConfig = {
    "Average Understanding": {
        label: 'Avg. Understanding',
        color: 'hsl(var(--primary))',
    }
}

export function ConceptDifficultyChart({ data }: { data: AdminConceptDifficulty[] }) {
  return (
    <ChartContainer config={chartConfigDifficulty} className="h-[300px] w-full">
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid horizontal={false} />
          <YAxis
            dataKey="conceptName"
            type="category"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            width={120}
            className="text-xs"
          />
          <XAxis type="number" dataKey="difficulty" domain={[0, 100]} />
          <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
          <Bar dataKey="difficulty" radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}


export function TrendsChart({ data }: { data: AdminTrend[] }) {
    return (
        <ChartContainer config={chartConfigTrends} className="h-[300px] w-full">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ right: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} />
            <YAxis domain={[0, 100]} />
            <Tooltip content={<ChartTooltipContent indicator="dot" />} />
            <Legend />
            <Line type="monotone" dataKey="Average Understanding" stroke="var(--color-Average Understanding)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    );
}
