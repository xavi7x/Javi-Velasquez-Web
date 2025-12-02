'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, RefreshCw, Zap, Shield, 
  Cpu, Activity, Terminal, Crosshair, List, Grid, Info, Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// --- CONFIGURACIÓN DE ACTIVOS ---
const INITIAL_ASSETS = [
  { symbol: 'NVDA', name: 'NVIDIA Corp', sector: 'TECNOLOGÍA', type: 'risk' },
  { symbol: 'AMD', name: 'Advanced Micro', sector: 'TECNOLOGÍA', type: 'risk' },
  { symbol: 'AAPL', name: 'Apple Inc', sector: 'TECNOLOGÍA', type: 'risk' },
  { symbol: 'KO', name: 'Coca-Cola', sector: 'CONSUMO', type: 'safe' },
  { symbol: 'WMT', name: 'Walmart Inc', sector: 'CONSUMO', type: 'safe' },
  { symbol: 'PG', name: 'P&G Company', sector: 'CONSUMO', type: 'safe' },
  { symbol: 'XLE', name: 'Energy ETF', sector: 'ENERGÍA', type: 'div' },
  { symbol: 'JPM', name: 'JP Morgan', sector: 'FINANZAS', type: 'div' },
];

// --- LÓGICA DE TRADING (Simulación) ---
const simulateBackendScan = (assets: typeof INITIAL_ASSETS) => {
  return assets.map(asset => {
    const basePrices: { [key: string]: number } = { 'NVDA': 135, 'AMD': 140, 'AAPL': 225, 'KO': 62, 'WMT': 85, 'PG': 168, 'XLE': 90, 'JPM': 220 };
    const base = basePrices[asset.symbol] || 100;
    const currentPrice = base + ((Math.random() - 0.5) * 10);
    const sma50 = currentPrice + ((Math.random() - 0.5) * 15);
    const rsi = Math.floor(Math.random() * 80) + 10;
    const change = ((Math.random() - 0.5) * 4).toFixed(2);

    let signal = { action: 'MANTENER', color: 'text-muted-foreground border-border bg-muted/50', glow: '', reason: 'NEUTRAL' };
    
    if (rsi < 30) signal = { action: 'COMPRAR', color: 'text-primary-foreground border-primary bg-primary/20', glow: 'shadow-[0_0_15px_hsl(var(--primary))]', reason: 'SOBREVENTA' };
    else if (rsi > 70) signal = { action: 'VENDER', color: 'text-destructive-foreground border-destructive bg-destructive/20', glow: 'shadow-[0_0_15px_hsl(var(--destructive))]', reason: 'SOBRECOMPRA' };
    else if (currentPrice > sma50 && rsi >= 45 && rsi <= 65) signal = { action: 'ACUMULAR', color: 'text-emerald-500 border-emerald-500 bg-emerald-500/20', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.4)]', reason: 'TENDENCIA ALCISTA' };

    return {
      ...asset,
      price: currentPrice.toFixed(2),
      change,
      rsi,
      sma50: sma50.toFixed(2),
      trend: currentPrice > sma50 ? 'SUBIENDO' : 'BAJANDO',
      signal
    };
  });
};

export default function InvestmentsDashboard() {
  const [marketData, setMarketData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [showLegend, setShowLegend] = useState(false);
  const [fintualValue, setFintualValue] = useState<number | null>(null);

  const handleScan = () => {
    setLoading(true);
    setTimeout(() => {
      const data = simulateBackendScan(INITIAL_ASSETS);
      setMarketData(data);
      setFintualValue(1250000); 
      setLoading(false);
    }, 1200);
  };

  useEffect(() => {
    handleScan();
  }, []);

  return (
    <div className="font-sans selection:bg-indigo-500/30 p-6 flex justify-center">
      
      <div className="max-w-7xl w-full space-y-8">
        
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-border pb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
              Panel de <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Control Financiero</span>
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
               Inteligencia Artificial aplicada a tus activos.
            </p>
          </div>

          <div className="flex gap-3">
            <div className="flex bg-muted border border-border rounded-lg p-1">
              <button 
                onClick={() => setViewMode('grid')}
                className={cn('p-2 rounded-md transition-all', viewMode === 'grid' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground')}
              >
                <Grid size={18} />
              </button>
              <button 
                onClick={() => setViewMode('table')}
                className={cn('p-2 rounded-md transition-all', viewMode === 'table' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground')}
              >
                <List size={18} />
              </button>
            </div>

            <button 
              onClick={() => setShowLegend(!showLegend)}
              className={cn('px-4 py-2 rounded-lg border text-xs font-bold tracking-wider flex items-center gap-2 transition-all', showLegend ? 'bg-muted border-primary text-primary' : 'border-border text-muted-foreground hover:bg-muted')}
            >
              <Info size={16} /> <span className="hidden sm:inline">LEYENDA</span>
            </button>

            <Button onClick={handleScan} disabled={loading} size="sm" className="h-10 px-6">
              <RefreshCw className={cn("w-4 h-4", loading && 'animate-spin')} />
              {loading ? 'Analizando...' : 'Escanear Mercado'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl opacity-30 group-hover:opacity-60 blur transition duration-500"></div>
                <div className="relative bg-card rounded-xl p-6 border border-border h-full flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Activity size={16} className="text-primary"/>
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Saldo Fintual</span>
                        </div>
                        <div className="text-3xl font-bold text-foreground">
                            {loading ? '...' : fintualValue ? `$${(fintualValue/1000000).toFixed(2)}M CLP` : '---'}
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                        <span>API Conectada</span>
                        <div className="flex items-center gap-1 text-emerald-400"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div> Online</div>
                    </div>
                </div>
            </div>

            <div className="relative bg-card rounded-xl p-6 border border-border group hover:border-red-500/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                         <Shield size={16} className="text-red-400"/> Posición NVIDIA
                    </span>
                    <span className="px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-500 text-[10px] font-bold border border-yellow-500/20">HOLD</span>
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">-$211.00 <span className="text-sm text-muted-foreground font-normal">USD</span></div>
                <p className="text-xs text-muted-foreground">Pérdida no realizada. Esperando rebote técnico.</p>
            </div>

            <div className="relative bg-card rounded-xl p-6 border border-border group hover:border-emerald-500/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                         <Zap size={16} className="text-emerald-400"/> Liquidez
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold border border-emerald-500/20">READY</span>
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">$700.00 <span className="text-sm text-muted-foreground font-normal">USD</span></div>
                <p className="text-xs text-muted-foreground">Objetivo: Swing Trading (Consumo/Energía).</p>
            </div>
        </div>

        {showLegend && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-muted/50 border border-border p-4 rounded-xl animate-fade-in-up">
             <div className="space-y-1">
                <div className="text-xs font-bold text-primary">COMPRAR (BUY)</div>
                <p className="text-[10px] text-muted-foreground">RSI &lt; 30. Activo barato con alta probabilidad de rebote.</p>
             </div>
             <div className="space-y-1">
                <div className="text-xs font-bold text-emerald-400">ACUMULAR (LONG)</div>
                <p className="text-[10px] text-muted-foreground">Tendencia alcista sana. Buen momento para sumar.</p>
             </div>
             <div className="space-y-1">
                <div className="text-xs font-bold text-destructive">VENDER (SELL)</div>
                <p className="text-[10px] text-muted-foreground">RSI &gt; 70. Activo caro. Riesgo de corrección.</p>
             </div>
             <div className="space-y-1">
                <div className="text-xs font-bold text-muted-foreground">MANTENER (HOLD)</div>
                <p className="text-[10px] text-muted-foreground">Zona neutra. No hay señal clara.</p>
             </div>
          </div>
        )}

        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {marketData.map((stock) => (
              <div key={stock.symbol} className={cn('relative bg-card rounded-2xl border transition-all duration-300 group hover:-translate-y-1 overflow-hidden', stock.signal.action !== 'MANTENER' ? 'border-primary/30' : 'border-border')}>
                
                {stock.signal.action !== 'MANTENER' && (
                  <div className={cn('absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none', stock.signal.glow)}></div>
                )}

                <div className="p-6 relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{stock.symbol}</h3>
                      <span className="text-[10px] text-muted-foreground font-bold tracking-widest bg-muted px-2 py-0.5 rounded">{stock.sector}</span>
                    </div>
                    <div className={cn('text-[10px] font-bold border px-3 py-1 rounded-full tracking-wider', stock.signal.color)}>
                      {stock.signal.action}
                    </div>
                  </div>

                  <div className="flex justify-between items-end border-b border-border pb-4 mb-4">
                    <span className="text-2xl text-foreground font-mono tracking-tight">${stock.price}</span>
                    <span className={cn('text-xs font-bold', parseFloat(stock.change) >= 0 ? 'text-emerald-500' : 'text-red-500')}>
                      {parseFloat(stock.change) > 0 ? '+' : ''}{stock.change}%
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-[10px] mb-1.5">
                        <span className="text-muted-foreground font-medium">Fuerza Relativa (RSI)</span>
                        <span className={cn(stock.rsi < 30 ? 'text-primary font-bold' : stock.rsi > 70 ? 'text-destructive font-bold' : 'text-muted-foreground')}>{stock.rsi}/100</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className={cn('h-full rounded-full transition-all duration-1000', stock.rsi < 30 ? 'bg-primary' : stock.rsi > 70 ? 'bg-destructive' : 'bg-muted-foreground/50')} 
                          style={{ width: `${stock.rsi}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'table' && (
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="p-5 font-medium">Activo</th>
                  <th className="p-5 font-medium">Precio</th>
                  <th className="p-5 font-medium">Cambio (24h)</th>
                  <th className="p-5 font-medium">RSI (14)</th>
                  <th className="p-5 font-medium">Tendencia</th>
                  <th className="p-5 font-medium text-right">Señal IA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {marketData.map((stock) => (
                  <tr key={stock.symbol} className="hover:bg-muted/50 transition-colors">
                    <td className="p-5">
                      <div className="font-bold text-foreground">{stock.symbol}</div>
                      <div className="text-[10px] text-muted-foreground uppercase">{stock.name}</div>
                    </td>
                    <td className="p-5 font-mono text-foreground">${stock.price}</td>
                    <td className={cn('p-5 font-bold', parseFloat(stock.change) >= 0 ? 'text-emerald-500' : 'text-red-500')}>
                      {parseFloat(stock.change) > 0 ? '+' : ''}{stock.change}%
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2">
                          <div className={'w-16 h-1 rounded-full bg-muted overflow-hidden'}>
                              <div className={cn('h-full', stock.rsi < 30 ? 'bg-primary' : stock.rsi > 70 ? 'bg-destructive' : 'bg-muted-foreground')} style={{width: `${stock.rsi}%`}}></div>
                          </div>
                          <span className="text-xs text-muted-foreground">{stock.rsi}</span>
                      </div>
                    </td>
                    <td className="p-5 text-[10px]">
                      {stock.trend === 'SUBIENDO' ? (
                        <span className="text-emerald-500 flex items-center gap-1 font-medium"><TrendingUp size={14}/> ALCISTA</span>
                      ) : (
                        <span className="text-red-500 flex items-center gap-1 font-medium"><TrendingDown size={14}/> BAJISTA</span>
                      )}
                    </td>
                    <td className="p-5 text-right">
                       <span className={cn('text-[10px] font-bold border px-3 py-1 rounded-full tracking-wider', stock.signal.color)}>
                        {stock.signal.action}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="flex justify-center pt-8 opacity-40 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest">
                <Lock size={10} /> Conexión Segura v3.0 • Javi Velásquez Portal
            </div>
        </div>

      </div>
    </div>
  );
}
