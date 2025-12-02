'use client';

import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, Zap, Shield, 
  Activity, Grid, List, Info, Wifi, CloudOff, Lock, 
  BrainCircuit, Lightbulb, TrendingUp, AlertTriangle
} from 'lucide-react';

// --- CONFIGURACIÓN CRÍTICA ---
// 1. Tu saldo real de Fintual (cámbialo manualmente aquí cuando quieras)
const SALDO_FINTUAL_MANUAL = 1250000; 

// 2. LA URL DE TU BACKEND (Pega aquí la URL que copiaste de la terminal tras el 'firebase deploy')
// Ejemplo: "https://us-central1-velsquez-digital.cloudfunctions.net/marketScanner"
const API_URL = "https://us-central1-velsquez-digital.cloudfunctions.net/marketScanner"; 


// --- CONFIGURACIÓN DE ACTIVOS (LISTA MAESTRA) ---
const INITIAL_ASSETS = [
  // 1. CRECIMIENTO AGRESIVO (Tech & IA)
  { symbol: 'NVDA', name: 'NVIDIA Corp', sector: 'TECNOLOGÍA', type: 'risk' },
  { symbol: 'AMD', name: 'Advanced Micro', sector: 'TECNOLOGÍA', type: 'risk' },
  { symbol: 'TSLA', name: 'Tesla Inc', sector: 'AUTOMOTRIZ', type: 'risk' }, 
  { symbol: 'QQQ', name: 'Invesco QQQ', sector: 'ETF TECH', type: 'risk' },

  // 2. SEGURIDAD Y DIVIDENDOS (Defensivas)
  { symbol: 'KO', name: 'Coca-Cola', sector: 'CONSUMO', type: 'safe' },
  { symbol: 'WMT', name: 'Walmart Inc', sector: 'CONSUMO', type: 'safe' },
  { symbol: 'O', name: 'Realty Income', sector: 'INMOBILIARIO', type: 'div' }, 
  { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'SALUD', type: 'safe' },

  // 3. MERCADO GENERAL (Base del Interés Compuesto)
  { symbol: 'VOO', name: 'Vanguard S&P 500', sector: 'ETF MERCADO', type: 'safe' },
  { symbol: 'XLE', name: 'Energy Select', sector: 'ENERGÍA', type: 'div' },
  { symbol: 'JPM', name: 'JP Morgan', sector: 'FINANZAS', type: 'div' },
  { symbol: 'GLD', name: 'SPDR Gold Trust', sector: 'ORO', type: 'safe' }, 
];

// --- TIPS DE INTELIGENCIA ARTIFICIAL ---
const AI_TIPS = [
  {
    icon: <TrendingUp size={20} className="text-emerald-400" />,
    title: "¿Qué es el RSI?",
    text: "El Índice de Fuerza Relativa mide si una acción está 'sobrecomprada' (cara) o 'sobrevendida' (barata). Si el RSI baja de 30, suele ser una buena oportunidad de compra."
  },
  {
    icon: <Activity size={20} className="text-indigo-400" />,
    title: "La Tendencia es tu Amiga",
    text: "Este panel usa la Media Móvil de 50 días (SMA). Si el precio actual está por encima de esta línea, la tendencia es alcista y es más seguro invertir."
  },
  {
    icon: <Shield size={20} className="text-pink-400" />,
    title: "Gestión de Riesgo",
    text: "Nunca pongas todo tu capital en una sola acción (como NVIDIA). Usa ETFs como VOO o QQQ para protegerte si una empresa específica cae."
  },
  {
    icon: <BrainCircuit size={20} className="text-yellow-400" />,
    title: "Psicología del Mercado",
    text: "Cuando veas rojo (pérdidas), no vendas por pánico. El mercado transfiere dinero del impaciente al paciente. Espera la señal de la IA."
  }
];

// --- MODO DEMO (Fallback) ---
const simulateBackendScan = (assets: typeof INITIAL_ASSETS) => {
  return assets.map(asset => {
    const price = (Math.random() * 100 + 50).toFixed(2);
    return { 
      ...asset, 
      price: price, 
      change: (Math.random() * 4 - 2).toFixed(2), 
      rsi: Math.floor(Math.random() * 80 + 10), 
      trend: Math.random() > 0.5 ? "SUBIENDO" : "BAJANDO", 
      signal: { action: "MANTENER", color: "text-slate-400 border-slate-700 bg-slate-800", reason: "SIMULADO" }
    };
  });
};

export default function InvestmentsPage() {
  const [marketData, setMarketData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showLegend, setShowLegend] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const handleScan = async () => {
    setLoading(true);
    
    if (API_URL === "PEGAR_TU_URL_DE_FUNCION_AQUI" || !API_URL) {
        console.warn("Falta configurar la API_URL en el código");
        await new Promise(r => setTimeout(r, 1000));
        setMarketData(simulateBackendScan(INITIAL_ASSETS));
        setIsDemoMode(true);
        setLoading(false);
        return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assets: INITIAL_ASSETS })
      });

      if (!response.ok) throw new Error('Error de conexión con el servidor');

      const data = await response.json();
      setMarketData(data.stocks); 
      setIsDemoMode(false);

    } catch (error) {
      console.warn("Backend no disponible, usando simulación:", error);
      await new Promise(r => setTimeout(r, 1000));
      setMarketData(simulateBackendScan(INITIAL_ASSETS));
      setIsDemoMode(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleScan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 p-6 flex justify-center">
      
      <div className="max-w-7xl w-full space-y-12">
        
        {/* HEADER DE SECCIÓN */}
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-medium border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 animate-fade-in">
                    Portal Privado
                </span>
                {isDemoMode ? (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                    <CloudOff size={10} /> MODO OFFLINE / DEMO
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    <Wifi size={10} /> DATOS EN VIVO
                  </span>
                )}
            </div>
            
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-900 rounded-full border border-white/5">
                <div className="text-right hidden sm:block">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Javi Velásquez</p>
                    <p className="text-xs font-bold text-white">Admin</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                    JV
                </div>
            </div>
        </div>

        {/* TÍTULO PRINCIPAL */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Panel de <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Control Financiero</span>
            </h1>
            <p className="text-slate-400 mt-2 text-lg">
               Inteligencia Artificial aplicada a tus activos.
            </p>
          </div>

          <div className="flex gap-3">
            <div className="flex bg-slate-900 border border-white/10 rounded-lg p-1">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Grid size={18} />
              </button>
              <button 
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-md transition-all ${viewMode === 'table' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <List size={18} />
              </button>
            </div>

            <button 
              onClick={() => setShowLegend(!showLegend)}
              className={`px-4 py-2 rounded-lg border text-xs font-bold tracking-wider flex items-center gap-2 transition-all ${showLegend ? 'bg-slate-800 border-indigo-500 text-indigo-400' : 'border-white/10 text-slate-400 hover:bg-slate-900'}`}
            >
              <Info size={16} /> <span className="hidden sm:inline">LEYENDA</span>
            </button>

            <button 
              onClick={handleScan}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg shadow-indigo-500/20 active:scale-95 transition-all disabled:opacity-50 font-medium text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Analizando...' : 'Escanear Mercado'}
            </button>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl opacity-30 group-hover:opacity-60 blur transition duration-500"></div>
                <div className="relative bg-slate-900 rounded-xl p-6 border border-white/10 h-full flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Activity size={16} className="text-indigo-400"/>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Patrimonio Fintual</span>
                        </div>
                        <div className="text-3xl font-bold text-white">
                            ${SALDO_FINTUAL_MANUAL.toLocaleString('es-CL')} <span className="text-sm font-normal text-slate-500">CLP</span>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 text-xs text-slate-500 flex justify-between">
                        <span>Ingreso Manual</span>
                        <Lock size={12} className="text-slate-600"/>
                    </div>
                </div>
            </div>

            <div className="relative bg-slate-900 rounded-xl p-6 border border-white/10 group hover:border-red-500/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                         <Shield size={16} className="text-red-400"/> Posición NVIDIA
                    </span>
                    <span className="px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-500 text-[10px] font-bold border border-yellow-500/20">HOLD</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">-$211.00 <span className="text-sm text-slate-500 font-normal">USD</span></div>
                <p className="text-xs text-slate-500">Pérdida no realizada. Esperando rebote.</p>
            </div>

            <div className="relative bg-slate-900 rounded-xl p-6 border border-white/10 group hover:border-emerald-500/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                         <Zap size={16} className="text-emerald-400"/> Liquidez
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold border border-emerald-500/20">READY</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">$700.00 <span className="text-sm text-slate-500 font-normal">USD</span></div>
                <p className="text-xs text-slate-500">Objetivo: Buscar señal "COMPRAR".</p>
            </div>
        </div>

        {/* LEYENDA (Desplegable) */}
        {showLegend && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900 border border-white/10 p-4 rounded-xl animate-fade-in">
             <div className="space-y-1">
                <div className="text-xs font-bold text-indigo-400">COMPRAR (BUY)</div>
                <p className="text-[10px] text-slate-400">RSI &lt; 30. Activo barato con alta probabilidad de rebote.</p>
             </div>
             <div className="space-y-1">
                <div className="text-xs font-bold text-emerald-400">ACUMULAR (LONG)</div>
                <p className="text-[10px] text-slate-400">Tendencia alcista sana. Buen momento para sumar.</p>
             </div>
             <div className="space-y-1">
                <div className="text-xs font-bold text-pink-400">VENDER (SELL)</div>
                <p className="text-[10px] text-slate-400">RSI &gt; 70. Activo caro. Riesgo de corrección.</p>
             </div>
             <div className="space-y-1">
                <div className="text-xs font-bold text-slate-400">MANTENER (HOLD)</div>
                <p className="text-[10px] text-slate-500">Zona neutra. No hay señal clara.</p>
             </div>
          </div>
        )}

        {/* DATA GRID */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {marketData.map((stock) => (
              <div key={stock.symbol} className={`relative bg-slate-900 rounded-2xl border transition-all duration-300 group hover:-translate-y-1 overflow-hidden ${stock.signal.action === 'COMPRAR' ? 'border-indigo-500' : stock.signal.action === 'VENDER' ? 'border-pink-500' : 'border-white/5'}`}>
                
                {stock.signal.action !== 'MANTENER' && (
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${stock.signal.action === 'COMPRAR' ? 'bg-indigo-500/10' : 'bg-pink-500/10'}`}></div>
                )}

                <div className="p-6 relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white">{stock.symbol}</h3>
                      <span className="text-[10px] text-slate-500 font-bold tracking-widest bg-slate-800 px-2 py-0.5 rounded">{stock.sector}</span>
                    </div>
                    <div className={`text-[10px] font-bold border px-3 py-1 rounded-full tracking-wider ${stock.signal.color}`}>
                      {stock.signal.action}
                    </div>
                  </div>

                  <div className="flex justify-between items-end border-b border-white/5 pb-4 mb-4">
                    <span className="text-2xl text-white font-mono tracking-tight">${stock.price}</span>
                    <span className={`text-xs font-bold ${parseFloat(stock.change) >= 0 ? 'text-emerald-400' : 'text-pink-400'}`}>
                      {parseFloat(stock.change) > 0 ? '+' : ''}{stock.change}%
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-[10px] mb-1.5">
                        <span className="text-slate-500 font-medium">Fuerza Relativa (RSI)</span>
                        <span className={stock.rsi < 30 ? 'text-indigo-400 font-bold' : stock.rsi > 70 ? 'text-pink-400 font-bold' : 'text-slate-400'}>{stock.rsi}/100</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${stock.rsi < 30 ? 'bg-indigo-500' : stock.rsi > 70 ? 'bg-pink-500' : 'bg-slate-600'}`} 
                          style={{ width: `${stock.rsi}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-400 text-center italic mt-2">
                        {stock.signal.reason}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DATA TABLE */}
        {viewMode === 'table' && (
          <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/10">
                <tr>
                  <th className="p-5 font-medium">Activo</th>
                  <th className="p-5 font-medium">Precio</th>
                  <th className="p-5 font-medium">Cambio (24h)</th>
                  <th className="p-5 font-medium">RSI (14)</th>
                  <th className="p-5 font-medium">Tendencia</th>
                  <th className="p-5 font-medium text-right">Señal IA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {marketData.map((stock) => (
                  <tr key={stock.symbol} className="hover:bg-white/5 transition-colors">
                    <td className="p-5">
                      <div className="font-bold text-white">{stock.symbol}</div>
                      <div className="text-[10px] text-slate-500 uppercase">{stock.name}</div>
                    </td>
                    <td className="p-5 font-mono text-slate-200">${stock.price}</td>
                    <td className={`p-5 font-bold ${parseFloat(stock.change) >= 0 ? 'text-emerald-400' : 'text-pink-400'}`}>
                      {parseFloat(stock.change) > 0 ? '+' : ''}{stock.change}%
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2">
                          <div className={`w-16 h-1 rounded-full bg-slate-800 overflow-hidden`}>
                              <div className={`h-full ${stock.rsi < 30 ? 'bg-indigo-500' : stock.rsi > 70 ? 'bg-pink-500' : 'bg-slate-500'}`} style={{width: `${stock.rsi}%`}}></div>
                          </div>
                          <span className="text-xs text-slate-400">{stock.rsi}</span>
                      </div>
                    </td>
                    <td className="p-5 text-[10px]">
                      {stock.trend === 'SUBIENDO' ? (
                        <span className="text-emerald-400 flex items-center gap-1 font-medium"><TrendingUp size={14}/> ALCISTA</span>
                      ) : (
                        <span className="text-pink-400 flex items-center gap-1 font-medium"><TrendingDown size={14}/> BAJISTA</span>
                      )}
                    </td>
                    <td className="p-5 text-right">
                       <span className={`text-[10px] font-bold border px-3 py-1 rounded-full tracking-wider ${stock.signal.color}`}>
                        {stock.signal.action}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- NUEVA SECCIÓN: AI INSIGHTS & TIPS --- */}
        <div className="border-t border-white/5 pt-10 mt-10">
            <div className="flex items-center gap-2 mb-6">
                <Lightbulb className="text-indigo-400" size={24} />
                <h2 className="text-xl font-bold text-white">Bitácora de Inteligencia Artificial</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {AI_TIPS.map((tip, index) => (
                    <div key={index} className="bg-slate-900/50 border border-white/5 p-5 rounded-xl hover:bg-slate-900 transition-colors">
                        <div className="mb-3 bg-slate-800 w-10 h-10 rounded-lg flex items-center justify-center">
                            {tip.icon}
                        </div>
                        <h3 className="font-bold text-white mb-2 text-sm">{tip.title}</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            {tip.text}
                        </p>
                    </div>
                ))}
            </div>
        </div>
        
        <div className="flex justify-center pt-8 opacity-40 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest">
                <Lock size={10} /> Conexión Segura v3.0 • Javi Velásquez Portal
            </div>
        </div>

      </div>
    </div>
  );
}