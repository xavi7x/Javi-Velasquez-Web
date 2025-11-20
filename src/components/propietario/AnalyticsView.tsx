'use client';

import { useState, useEffect } from 'react';
import { BarChart, LineChart, Loader2, AlertCircle } from 'lucide-react';
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
} from '@/components/ui/chart';
import {
  Bar,
  BarChart as RechartsBarChart,
  Line,
  LineChart as RechartsLineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';
import { getAnalyticsData, type AnalyticsDataOutput } from '@/ai/flows/get-analytics-data';
import { Skeleton } from '../ui/skeleton';

const chartConfig = {
  visitors: {
    label: 'Visitantes',
    color: 'hsl(var(--chart-1))',
  },
};

const sourceColors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
];

export function AnalyticsView() {
  const [data, setData] = useState<AnalyticsDataOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getAnalyticsData();
        setData(result);
      } catch (e: any) {
        setError(e.message || 'Ocurrió un error al cargar los datos de Analytics.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
        <div className="space-y-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="pb-2">
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-10 w-1/3" />
                        </CardHeader>
                        <CardFooter>
                           <Skeleton className="h-3 w-1/2" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
            <div className="grid gap-6 md:grid-cols-2">
                 <Card><CardContent className="p-6"><Skeleton className="h-[250px] w-full" /></CardContent></Card>
                 <Card><CardContent className="p-6"><Skeleton className="h-[250px] w-full" /></CardContent></Card>
            </div>
        </div>
    );
  }

  if (error) {
    return (
        <Card className="col-span-full">
            <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                    <AlertCircle />
                    Error al cargar datos
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p>No se pudieron obtener los datos de Google Analytics.</p>
                <pre className="mt-4 p-4 bg-muted rounded-md text-xs whitespace-pre-wrap font-code">
                    {error}
                </pre>
                 <p className="mt-4 text-sm text-muted-foreground">
                    Asegúrate de que las variables de entorno `GA4_PROPERTY_ID` y `GOOGLE_ANALYTICS_CREDENTIALS` están configuradas correctamente en el archivo `.env`.
                </p>
            </CardContent>
        </Card>
    )
  }

  if (!data) {
    return <p>No hay datos disponibles.</p>;
  }

  const { stats, monthlyVisitors, trafficSources } = data;
  
  const sourceDataWithFill = trafficSources.map((item, index) => ({
    ...item,
    fill: sourceColors[index % sourceColors.length],
  }));

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Visitantes Únicos</CardDescription>
            <CardTitle className="text-4xl">{stats.totalUsers}</CardTitle>
          </CardHeader>
          <CardFooter>
            <p className="text-xs text-muted-foreground">Últimos 28 días</p>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Vistas de Página</CardDescription>
            <CardTitle className="text-4xl">{stats.pageViews}</CardTitle>
          </CardHeader>
          <CardFooter>
            <p className="text-xs text-muted-foreground">Últimos 28 días</p>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tasa de Rebote</CardDescription>
            <CardTitle className="text-4xl">{stats.bounceRate}</CardTitle>
          </CardHeader>
          <CardFooter>
             <p className="text-xs text-muted-foreground">Últimos 28 días</p>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Duración de la Sesión</CardDescription>
            <CardTitle className="text-4xl">{stats.averageSessionDuration}</CardTitle>
          </CardHeader>
          <CardFooter>
            <p className="text-xs text-muted-foreground">Últimos 28 días</p>
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
              <RechartsLineChart data={monthlyVisitors}>
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
              <RechartsBarChart data={sourceDataWithFill} layout="vertical">
                 <CartesianGrid horizontal={false} />
                <YAxis
                  dataKey="source"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  width={80}
                  tick={{ fontSize: 12 }}
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
