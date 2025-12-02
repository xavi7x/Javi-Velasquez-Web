'use client';

import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, Zap, Shield, 
  Activity, Grid, List, Info, Wifi, CloudOff, Lock, 
  BrainCircuit, Lightbulb, TrendingUp, AlertTriangle,
  Filter, Edit2, Check, X
} from 'lucide-react';

// --- CONFIGURACIÓN BACKEND ---
// Pega aquí tu URL real de Firebase Functions
const API_URL = "https://us-central1-velsquez-digital.cloudfunctions.net/marketScanner"; 

// --- CONFIGURACIÓN DE ACTIVOS ---
const INITIAL_ASSETS = [
  // 1. CRECIMIENTO AGRESIVO
  { symbol: 'NVDA', name: 'NVIDIA Corp', sector: 'TECNOLOGÍA', type: 'risk' },
  { symbol: 'AMD', name: 'Advanced Micro', sector: 'TECNOLOGÍA', type: 'risk' },
  { symbol: 'TSLA', name: 'Tesla Inc', sector: 'AUTOMOTRIZ', type: 'risk' }, 
  { symbol: 'QQQ', name: 'Invesco QQQ', sector: 'ETF TECH', type: 'risk' },

  // 2. SEGURIDAD Y DIVIDENDOS
  { symbol: 'KO', name: 'Coca-Cola', sector: 'CONSUMO', type: 'safe' },
  { symbol: 'WMT', name: 'Walmart Inc', sector: 'CONSUMO', type: 'safe' },
  { symbol: 'O', name: 'Realty Income', sector: 'INMOBILIARIO', type: 'div' }, 
  { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'SALUD', type: 'safe' },

  // 3. MERCADO GENERAL
  { symbol: 'VOO', name: 'Vanguard S&P 500', sector: 'ETF MERCADO', type: 'safe' },
  { symbol: 'XLE', name: 'Energy Select', sector: 'ENERGÍA', type: 'div' },
  { symbol: 'JPM', name: 'JP Morgan', sector: 'FINANZAS', type: 'div' },
  { symbol: 'GLD', name: 'SPDR Gold Trust', sector: 'ORO', type: 'safe' }, 
];

// --- TIPS DE INTELIGENCIA ARTIFICIAL (RESTORED) ---
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

// --- SIMULACIÓN DE DATOS (Fallback) ---
const simulateBackendScan = (assets: typeof INITIAL_ASSETS) => {
  return assets.map(asset => {
    const price = (Math.random() * 100 + 50).toFixed(2);
    const rsi = Math.floor(Math.random() * 80 + 10);
    const sma50 = parseFloat(price) - (Math.random() * 10 - 5);
    
    // Lógica simulada consistente con la real
    let signal = { action: 'MANTENER', color: 'text-slate-400 border-slate-700 bg-slate-800', reason: 'NEUTRAL' };
    if (rsi < 30) signal = { action: 'COMPRAR', color: 'text-indigo-300 border-indigo-500 bg-indigo-500/20', reason: 'SOBREVENTA' };
    else if (rsi > 70) signal = { action: 'VENDER', color: 'text-pink-300 border-pink-500 bg-pink-500/20', reason: 'SOBRECOMPRA' };
    else if (parseFloat(price) > sma50 && rsi >= 45 && rsi <= 65) signal = { action: 'ACUMULAR', color: 'text-emerald-300 border-emerald-500 bg-emerald-500/20', reason: 'TENDENCIA ALCISTA' };

    return { 
      ...asset, 
      price: price, 
      change: (Math.random() * 4 - 2).toFixed(2), 
      rsi: rsi, 
      trend: parseFloat(price) > sma50 ? "SUBIENDO" : "BAJANDO", 
      signal: signal
    };
  });
};

export default function InvestmentsPage() {
  // Estados de Datos
  const [marketData, setMarketData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Estados de UI
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showLegend, setShowLegend] = useState(false);
  const [filterMode, setFilterMode] = useState<'ALL' | 'COMPRAR' | 'VENDER' | 'MANTENER' | 'ACUMULAR'>('ALL');

  // Estados de Saldo Manual
  const [fintualBalance, setFintualBalance] = useState(1500.00); // Valor inicial en USD
  const [isEditingBalance, setIsEditingBalance] = useState(false);
  const [tempBalanceInput, setTempBalanceInput] = useState("");

  const handleScan = async () => {
    setLoading(true);
    
    if (API_URL === "PEGAR_TU_URL_DE_FUNCION_AQUI" || !API_URL) {
        console.warn("Falta URL Backend. Usando modo simulación.");
        await new Promise(r => setTimeout(r, 800));
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

      if (!response.ok) throw new Error('Error API');

      const data = await response.json();
      setMarketData(data.stocks); 
      setIsDemoMode(false);

    } catch (error) {
      console.warn("Backend offline. Usando modo simulación.");
      setMarketData(simulateBackendScan(INITIAL_ASSETS));
      setIsDemoMode(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { handleScan(); }, []);

  // --- LÓGICA DE FILTRADO ---
  const filteredData = marketData.filter(item => {
    if (filterMode === 'ALL') return true;
    return item.signal.action === filterMode;
  });

  // --- LÓGICA DE EDICIÓN DE SALDO ---
  const startEditing = () => {
    setTempBalanceInput(fintualBalance.toString());
    setIsEditingBalance(true);
  };

  const saveBalance = () => {
    const val = parseFloat(tempBalanceInput);
    if (!isNaN(val)) {
      setFintualBalance(val);
    }
    setIsEditingBalance(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 p-6 flex justify-center">
      
      <div className="max-w-7xl w-full space-y-10">
        
        {/* HEADER SUPERIOR */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-medium border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 animate-fade-in">
                    Portal Privado
                </span>
                {isDemoMode ? (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                    <CloudOff size={10} /> OFFLINE
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    <Wifi size={10} /> EN VIVO
                  </span>
                )}
            </div>
            
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-900 rounded-full border border-white/5">
                <div className="text-right hidden sm:block">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Javi Velásquez</p>
                    <p className="text-xs font-bold text-white">Admin</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">JV</div>
            </div>
        </div>

        {/* BARRA DE CONTROL PRINCIPAL */}
        <div className="flex flex-col lg:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Control <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Financiero</span>
            </h1>
            <p className="text-slate-400 mt-2 text-sm md:text-base">
               Inteligencia Artificial aplicada a tus activos.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-end">
            
            {/* BOTONES DE FILTRO */}
            <div className="flex bg-slate-900 border border-white/10 rounded-lg p-1 gap-1">
               <button 
                 onClick={() => setFilterMode('ALL')}
                 className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${filterMode === 'ALL' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}
               >
                 Todos
               </button>
               <button 
                 onClick={() => setFilterMode('COMPRAR')}
                 className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${filterMode === 'COMPRAR' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/50' : 'text-slate-500 hover:text-indigo-400'}`}
               >
                 Comprar
               </button>
               <button 
                 onClick={() => setFilterMode('VENDER')}
                 className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${filterMode === 'VENDER' ? 'bg-pink-500/20 text-pink-300 border border-pink-500/50' : 'text-slate-500 hover:text-pink-400'}`}
               >
                 Vender
               </button>
            </div>

            <div className="w-px h-8 bg-white/10 hidden lg:block mx-2"></div>

            {/* VISTAS */}
            <div className="flex bg-slate-900 border border-white/10 rounded-lg p-1">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}><Grid size={18} /></button>
              <button onClick={() => setViewMode('table')} className={`p-2 rounded-md transition-all ${viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}><List size={18} /></button>
            </div>

            <button 
              onClick={handleScan}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg shadow-indigo-500/20 active:scale-95 transition-all disabled:opacity-50 font-medium text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{loading ? 'Analizando...' : 'Escanear'}</span>
            </button>
          </div>
        </div>

        {/* TARJETAS DE MÉTRICAS (KPIs) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1. FINTUAL MANUAL (EDITABLE) */}
            <div className="relative group bg-slate-900 rounded-xl p-6 border border-white/10 flex flex-col justify-between hover:border-indigo-500/30 transition-colors">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-10 blur transition duration-500"></div>
                <div className="relative z-10 w-full">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-indigo-400">
                            <Activity size={18} />
                            <span className="text-xs font-bold uppercase tracking-wider">Patrimonio Fintual</span>
                        </div>
                        {/* Botón de Editar */}
                        {!isEditingBalance && (
                          <button onClick={startEditing} className="text-slate-600 hover:text-indigo-400 transition-colors p-1">
                            <Edit2 size={14} />
                          </button>
                        )}
                    </div>

                    {isEditingBalance ? (
                      <div className="flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
                        <span className="text-2xl font-bold text-slate-500">$</span>
                        <input 
                          type="number" 
                          value={tempBalanceInput}
                          onChange={(e) => setTempBalanceInput(e.target.value)}
                          className="bg-slate-800 text-white text-2xl font-bold w-full rounded px-2 py-1 border border-indigo-500 focus:outline-none"
                          autoFocus
                        />
                        <button onClick={saveBalance} className="bg-emerald-500/20 text-emerald-400 p-2 rounded hover:bg-emerald-500/30"><Check size={18} /></button>
                        <button onClick={() => setIsEditingBalance(false)} className="bg-slate-700 text-slate-400 p-2 rounded hover:bg-slate-600"><X size={18} /></button>
                      </div>
                    ) : (
                      <div className="text-3xl font-bold text-white">
                          ${fintualBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-sm font-normal text-slate-500">USD</span>
                      </div>
                    )}
                </div>
                <div className="relative z-10 mt-4 pt-4 border-t border-white/5 text-xs text-slate-500 flex justify-between items-center">
                    <span>Ingresado manualmente</span>
                    <Lock size={12} className="text-slate-600"/>
                </div>
            </div>

            {/* 2. NVIDIA */}
            <div className="bg-slate-900 rounded-xl p-6 border border-white/10 group hover:border-red-500/30 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                          <Shield size={18} className="text-red-400"/> Posición NVIDIA
                      </span>
                      <span className="px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-500 text-[10px] font-bold border border-yellow-500/20">HOLD</span>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">-$211.00 <span className="text-sm text-slate-500 font-normal">USD</span></div>
                </div>
                <p className="text-xs text-slate-500 pt-4 border-t border-white/5">Pérdida no realizada. Esperando rebote.</p>
            </div>

            {/* 3. LIQUIDEZ */}
            <div className="bg-slate-900 rounded-xl p-6 border border-white/10 group hover:border-emerald-500/30 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                          <Zap size={18} className="text-emerald-400"/> Liquidez
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold border border-emerald-500/20">READY</span>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">$700.00 <span className="text-sm text-slate-500 font-normal">USD</span></div>
                </div>
                <p className="text-xs text-slate-500 pt-4 border-t border-white/5">Objetivo: Buscar señal "COMPRAR".</p>
            </div>
        </div>

        {/* --- GRID DE ACTIVOS (FILTRADO) --- */}
        {filteredData.length === 0 && !loading ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-xl">
            <Filter size={40} className="mx-auto text-slate-700 mb-4" />
            <p className="text-slate-500">No hay activos con la señal "{filterMode}" en este momento.</p>
            <button onClick={() => setFilterMode('ALL')} className="text-indigo-400 text-sm mt-2 hover:underline">Ver todos</button>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredData.map((stock) => (
                  <div key={stock.symbol} className={`relative bg-slate-900 rounded-2xl border transition-all duration-300 group hover:-translate-y-1 overflow-hidden ${stock.signal.action === 'COMPRAR' ? 'border-indigo-500' : stock.signal.action === 'VENDER' ? 'border-pink-500' : 'border-white/5'}`}>
                    {/* Brillo de fondo para señales fuertes */}
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
                            <span className="text-slate-500 font-medium">RSI (14)</span>
                            <span className={stock.rsi < 30 ? 'text-indigo-400 font-bold' : stock.rsi > 70 ? 'text-pink-400 font-bold' : 'text-slate-400'}>{stock.rsi}/100</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-1000 ${stock.rsi < 30 ? 'bg-indigo-500' : stock.rsi > 70 ? 'bg-pink-500' : 'bg-slate-600'}`} style={{ width: `${stock.rsi}%` }}></div>
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
            ) : (
              <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/10">
                      <tr>
                        <th className="p-5 font-medium">Activo</th>
                        <th className="p-5 font-medium">Precio</th>
                        <th className="p-5 font-medium">Cambio</th>
                        <th className="p-5 font-medium">RSI</th>
                        <th className="p-5 font-medium">Tendencia</th>
                        <th className="p-5 font-medium text-right">Señal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredData.map((stock) => (
                        <tr key={stock.symbol} className="hover:bg-white/5 transition-colors">
                          <td className="p-5 font-bold text-white">{stock.symbol}</td>
                          <td className="p-5 font-mono text-slate-200">${stock.price}</td>
                          <td className={`p-5 font-bold ${parseFloat(stock.change) >= 0 ? 'text-emerald-400' : 'text-pink-400'}`}>{stock.change}%</td>
                          <td className="p-5"><span className="text-slate-400">{stock.rsi}</span></td>
                          <td className="p-5 text-[10px]">{stock.trend === 'SUBIENDO' ? <span className="text-emerald-400">ALCISTA</span> : <span className="text-pink-400">BAJISTA</span>}</td>
                          <td className="p-5 text-right"><span className={`text-[10px] font-bold border px-3 py-1 rounded-full ${stock.signal.color}`}>{stock.signal.action}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* --- SECCIÓN EDUCATIVA (AI TIPS) --- */}
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