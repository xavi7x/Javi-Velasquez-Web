'use client';
import { BarChart, LineChart } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import {
  Bar,
  BarChart as RechartsBarChart,
  Line,
  LineChart as RechartsLineChart,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const chartData = [
  { month: 'Enero', visitors: 186 },
  { month: 'Febrero', visitors: 305 },
  { month: 'Marzo', visitors: 237 },
  { month: 'Abril', visitors: 273 },
  { month: 'Mayo', visitors: 209 },
  { month: 'Junio', visitors: 214 },
];

const sourceData = [
    { source: 'Google', visitors: 1240, fill: "hsl(var(--chart-1))" },
    { source: 'Instagram', visitors: 870, fill: "hsl(var(--chart-2))" },
    { source: 'LinkedIn', visitors: 520, fill: "hsl(var(--chart-3))" },
    { source: 'Directo', visitors: 310, fill: "hsl(var(--chart-4))" },
    { source: 'Otros', visitors: 180, fill: "hsl(var(--chart-5))" },
]

const chartConfig = {
  visitors: {
    label: 'Visitantes',
    color: 'hsl(var(--chart-1))',
  },
};

export function AnalyticsView() {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Visitantes Únicos</CardDescription>
            <CardTitle className="text-4xl">1,254</CardTitle>
          </CardHeader>
          <CardFooter>
            <p className="text-xs text-muted-foreground">+25% desde el mes pasado</p>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Vistas de Página</CardDescription>
            <CardTitle className="text-4xl">3,480</CardTitle>
          </CardHeader>
          <CardFooter>
            <p className="text-xs text-muted-foreground">+15% desde el mes pasado</p>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tasa de Rebote</CardDescription>
            <CardTitle className="text-4xl">34.1%</CardTitle>
          </CardHeader>
          <CardFooter>
            <p className="text-xs text-muted-foreground">-5% desde el mes pasado</p>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Duración de la Sesión</CardDescription>
            <CardTitle className="text-4xl">3m 15s</CardTitle>
          </CardHeader>
          <CardFooter>
            <p className="text-xs text-muted-foreground">+10s desde el mes pasado</p>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Visitantes Mensuales</CardTitle>
            <CardDescription>Un resumen de los visitantes únicos a tu sitio en los últimos 6 meses.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
              <RechartsLineChart data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                 <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Line
                  dataKey="visitors"
                  type="monotone"
                  stroke="var(--color-visitors)"
                  strokeWidth={2}
                  dot={true}
                />
              </RechartsLineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fuentes de Tráfico</CardTitle>
            <CardDescription>De dónde provienen los visitantes de tu sitio web.</CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer config={{}} className="min-h-[200px] w-full">
              <RechartsBarChart data={sourceData} layout="vertical">
                 <CartesianGrid horizontal={false} />
                <YAxis
                  dataKey="source"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                />
                 <XAxis dataKey="visitors" type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                 <Bar dataKey="visitors" radius={5} />
              </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
