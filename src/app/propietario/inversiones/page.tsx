'use client';

import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, Zap, Shield, 
  Activity, Grid, List, Info, Wifi, CloudOff, Lock, 
  Filter, Edit2, Check, X, Plus, Trash2, HelpCircle,
  ArrowUp, ArrowDown, DollarSign, TrendingUp, TrendingDown
} from 'lucide-react';

// --- CONFIGURACIÓN BACKEND ---
const API_URL = "https://us-central1-velsquez-digital.cloudfunctions.net/marketScanner"; 

// --- CONFIGURACIÓN DE ACTIVOS (SCANNER) ---
const INITIAL_ASSETS = [
  { symbol: 'NVDA', name: 'NVIDIA Corp', sector: 'TECNOLOGÍA', type: 'risk' },
  { symbol: 'AMD', name: 'Advanced Micro', sector: 'TECNOLOGÍA', type: 'risk' },
  { symbol: 'TSLA', name: 'Tesla Inc', sector: 'AUTOMOTRIZ', type: 'risk' }, 
  { symbol: 'QQQ', name: 'Invesco QQQ', sector: 'ETF TECH', type: 'risk' },
  { symbol: 'KO', name: 'Coca-Cola', sector: 'CONSUMO', type: 'safe' },
  { symbol: 'WMT', name: 'Walmart Inc', sector: 'CONSUMO', type: 'safe' },
  { symbol: 'O', name: 'Realty Income', sector: 'INMOBILIARIO', type: 'div' }, 
  { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'SALUD', type: 'safe' },
  { symbol: 'VOO', name: 'Vanguard S&P 500', sector: 'ETF MERCADO', type: 'safe' },
  { symbol: 'XLE', name: 'Energy Select', sector: 'ENERGÍA', type: 'div' },
  { symbol: 'JPM', name: 'JP Morgan', sector: 'FINANZAS', type: 'div' },
  { symbol: 'GLD', name: 'SPDR Gold Trust', sector: 'ORO', type: 'safe' }, 
];

// --- COMPONENTE TOOLTIP ---
const Tooltip = ({ text, children }: { text: string, children: React.ReactNode }) => (
  <div className="group relative flex items-center gap-1 cursor-help">
    {children}
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 bg-black text-xs text-slate-200 p-2 rounded border border-white/20 shadow-xl z-50 text-center">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black"></div>
    </div>
  </div>
);

// --- SIMULACIÓN DE DATOS (Fallback) ---
const simulateBackendScan = (assets: typeof INITIAL_ASSETS) => {
  return assets.map(asset => {
    const price = (Math.random() * 100 + 50).toFixed(2);
    const rsi = Math.floor(Math.random() * 80 + 10);
    const sma50 = parseFloat(price) - (Math.random() * 10 - 5);
    
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
  // --- ESTADOS ---
  const [marketData, setMarketData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showLegend, setShowLegend] = useState(false);
  const [filterMode, setFilterMode] = useState<'ALL' | 'COMPRAR' | 'VENDER'>('ALL');
  
  // Estado Saldo Manual
  const [fintualBalance, setFintualBalance] = useState(1500.00);
  const [isEditingBalance, setIsEditingBalance] = useState(false);
  const [tempBalanceInput, setTempBalanceInput] = useState("");

  // Estado Ordenamiento Tabla
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  // Estado Portfolio (Posiciones Manuales)
  const [portfolio, setPortfolio] = useState<{ id: number, symbol: string, buyPrice: number, qty: number }[]>([]);
  const [isAddingPosition, setIsAddingPosition] = useState(false);
  const [newPosition, setNewPosition] = useState({ symbol: 'NVDA', buyPrice: '', qty: '' });

  // --- CARGA DE DATOS ---
  const handleScan = async () => {
    setLoading(true);
    if (API_URL === "PEGAR_TU_URL_DE_FUNCION_AQUI" || !API_URL) {
        console.warn("Falta URL Backend.");
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
      console.warn("Backend offline.");
      setMarketData(simulateBackendScan(INITIAL_ASSETS));
      setIsDemoMode(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { handleScan(); }, []);

  // --- LÓGICA DE ORDENAMIENTO (SORT) ---
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    let sortableItems = [...marketData];
    // Primero filtramos
    if (filterMode !== 'ALL') {
      sortableItems = sortableItems.filter(item => item.signal.action === filterMode);
    }
    // Luego ordenamos
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Manejo especial para valores numéricos que vienen como string
        if (sortConfig.key === 'price' || sortConfig.key === 'change' || sortConfig.key === 'rsi') {
            aValue = parseFloat(aValue);
            bValue = parseFloat(bValue);
        }
        // Manejo especial para Señal (alfabético por acción)
        if (sortConfig.key === 'signal') {
            aValue = a.signal.action;
            bValue = b.signal.action;
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [marketData, sortConfig, filterMode]);

  // --- LÓGICA PORTFOLIO ---
  const addPosition = () => {
    if (!newPosition.buyPrice || !newPosition.qty) return;
    setPortfolio([...portfolio, {
        id: Date.now(),
        symbol: newPosition.symbol,
        buyPrice: parseFloat(newPosition.buyPrice),
        qty: parseFloat(newPosition.qty)
    }]);
    setIsAddingPosition(false);
    setNewPosition({ symbol: 'NVDA', buyPrice: '', qty: '' });
  };

  const removePosition = (id: number) => {
    setPortfolio(portfolio.filter(p => p.id !== id));
  };

  const getPortfolioValue = () => {
    return portfolio.reduce((acc, pos) => {
        const currentData = marketData.find(m => m.symbol === pos.symbol);
        const currentPrice = currentData ? parseFloat(currentData.price) : pos.buyPrice;
        return acc + (currentPrice * pos.qty);
    }, 0);
  };

  const getPortfolioCost = () => portfolio.reduce((acc, pos) => acc + (pos.buyPrice * pos.qty), 0);

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 p-6 flex justify-center">
      <div className="max-w-7xl w-full space-y-10">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-medium border border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
                    Portal Privado
                </span>
                {isDemoMode ? (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"><CloudOff size={10} /> DEMO</span>
                ) : (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"><Wifi size={10} /> LIVE</span>
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

        {/* TÍTULO & CONTROLES */}
        <div className="flex flex-col lg:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Control <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Financiero</span>
            </h1>
            <p className="text-slate-400 mt-2 text-sm">Scanner de Oportunidades & Gestión de Cartera.</p>
          </div>

          <div className="flex flex-wrap gap-3 justify-end">
            <div className="flex bg-slate-900 border border-white/10 rounded-lg p-1 gap-1">
               <button onClick={() => setFilterMode('ALL')} className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${filterMode === 'ALL' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}>Todos</button>
               <button onClick={() => setFilterMode('COMPRAR')} className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${filterMode === 'COMPRAR' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/50' : 'text-slate-500 hover:text-indigo-400'}`}>Comprar</button>
               <button onClick={() => setFilterMode('VENDER')} className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${filterMode === 'VENDER' ? 'bg-pink-500/20 text-pink-300 border border-pink-500/50' : 'text-slate-500 hover:text-pink-400'}`}>Vender</button>
            </div>

            <div className="w-px h-8 bg-white/10 hidden lg:block mx-2"></div>

            <div className="flex bg-slate-900 border border-white/10 rounded-lg p-1">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}><Grid size={18} /></button>
              <button onClick={() => setViewMode('table')} className={`p-2 rounded-md transition-all ${viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}><List size={18} /></button>
            </div>

            <button onClick={() => setShowLegend(!showLegend)} className={`px-4 py-2 rounded-lg border text-xs font-bold tracking-wider flex items-center gap-2 transition-all ${showLegend ? 'bg-slate-800 border-indigo-500 text-indigo-400' : 'border-white/10 text-slate-400 hover:bg-slate-900'}`}>
              <Info size={16} /> Leyenda
            </button>

            <button onClick={handleScan} disabled={loading} className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg active:scale-95 transition-all disabled:opacity-50 font-medium text-sm">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{loading ? 'Analizando...' : 'Escanear'}</span>
            </button>
          </div>
        </div>

        {/* METRICS ROW (KPIs) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. PATRIMONIO FINTUAL (EDITABLE) */}
            <div className="relative group bg-slate-900 rounded-xl p-6 border border-white/10 flex flex-col justify-between hover:border-indigo-500/30 transition-colors">
                <div className="relative z-10 w-full">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-indigo-400">
                            <Activity size={18} />
                            <span className="text-xs font-bold uppercase tracking-wider">Patrimonio Fintual</span>
                        </div>
                        {!isEditingBalance && <button onClick={() => {setTempBalanceInput(fintualBalance.toString()); setIsEditingBalance(true);}} className="text-slate-600 hover:text-indigo-400 p-1"><Edit2 size={14} /></button>}
                    </div>
                    {isEditingBalance ? (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-slate-500">$</span>
                        <input type="number" value={tempBalanceInput} onChange={(e) => setTempBalanceInput(e.target.value)} className="bg-slate-800 text-white text-2xl font-bold w-full rounded px-2 py-1 border border-indigo-500 focus:outline-none" autoFocus />
                        <button onClick={() => {const val = parseFloat(tempBalanceInput); if (!isNaN(val)) setFintualBalance(val); setIsEditingBalance(false);}} className="bg-emerald-500/20 text-emerald-400 p-2 rounded"><Check size={18} /></button>
                      </div>
                    ) : (
                      <div className="text-3xl font-bold text-white">${fintualBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-sm font-normal text-slate-500">USD</span></div>
                    )}
                </div>
            </div>

            {/* 2. PORTFOLIO VALUE (AUTO-CALCULADO) */}
            <div className="bg-slate-900 rounded-xl p-6 border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-emerald-400">
                          <DollarSign size={18} />
                          <span className="text-xs font-bold uppercase tracking-wider">Valor Mis Posiciones</span>
                      </div>
                  </div>
                  <div className="text-3xl font-bold text-white">${getPortfolioValue().toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                </div>
                <div className="text-xs text-slate-500 pt-4 border-t border-white/5 flex justify-between">
                    <span>Costo Base: ${getPortfolioCost().toLocaleString()}</span>
                    <span className={(getPortfolioValue() - getPortfolioCost()) >= 0 ? "text-emerald-400" : "text-pink-400"}>
                        {(getPortfolioValue() - getPortfolioCost()) >= 0 ? "+" : ""}${(getPortfolioValue() - getPortfolioCost()).toFixed(2)}
                    </span>
                </div>
            </div>

            {/* 3. LIQUIDEZ */}
            <div className="bg-slate-900 rounded-xl p-6 border border-white/10 flex flex-col justify-between">
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

        {/* LEYENDA (Desplegable) */}
        {showLegend && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900 border border-white/10 p-4 rounded-xl animate-fade-in">
             <div className="space-y-1"><div className="text-xs font-bold text-indigo-400">COMPRAR (BUY)</div><p className="text-[10px] text-slate-400">RSI &lt; 30. Oportunidad de rebote.</p></div>
             <div className="space-y-1"><div className="text-xs font-bold text-emerald-400">ACUMULAR (LONG)</div><p className="text-[10px] text-slate-400">Tendencia alcista confirmada.</p></div>
             <div className="space-y-1"><div className="text-xs font-bold text-pink-400">VENDER (SELL)</div><p className="text-[10px] text-slate-400">RSI &gt; 70. Riesgo de caída.</p></div>
             <div className="space-y-1"><div className="text-xs font-bold text-slate-400">MANTENER (HOLD)</div><p className="text-[10px] text-slate-500">Sin señal clara.</p></div>
          </div>
        )}

        {/* --- SECCIÓN MIS POSICIONES --- */}
        <div className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden">
            <div className="bg-slate-800/50 p-4 border-b border-white/5 flex justify-between items-center">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Shield size={16} className="text-indigo-400"/> Mis Posiciones Activas
                </h3>
                <button onClick={() => setIsAddingPosition(!isAddingPosition)} className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded flex items-center gap-1 transition-colors">
                    <Plus size={14}/> Agregar Nueva
                </button>
            </div>
            
            {isAddingPosition && (
                <div className="p-4 bg-indigo-500/10 border-b border-indigo-500/20 flex flex-wrap gap-4 items-end animate-in fade-in">
                    <div>
                        <label className="text-[10px] text-indigo-300 uppercase font-bold block mb-1">Activo</label>
                        <select value={newPosition.symbol} onChange={(e) => setNewPosition({...newPosition, symbol: e.target.value})} className="bg-slate-900 border border-white/20 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-indigo-500">
                            {INITIAL_ASSETS.map(a => <option key={a.symbol} value={a.symbol}>{a.symbol}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] text-indigo-300 uppercase font-bold block mb-1">Precio Compra</label>
                        <input type="number" placeholder="Ej: 150.00" value={newPosition.buyPrice} onChange={(e) => setNewPosition({...newPosition, buyPrice: e.target.value})} className="bg-slate-900 border border-white/20 rounded px-2 py-1 text-sm text-white w-24 focus:outline-none focus:border-indigo-500"/>
                    </div>
                    <div>
                        <label className="text-[10px] text-indigo-300 uppercase font-bold block mb-1">Cantidad</label>
                        <input type="number" placeholder="Ej: 5" value={newPosition.qty} onChange={(e) => setNewPosition({...newPosition, qty: e.target.value})} className="bg-slate-900 border border-white/20 rounded px-2 py-1 text-sm text-white w-20 focus:outline-none focus:border-indigo-500"/>
                    </div>
                    <button onClick={addPosition} className="bg-indigo-500 hover:bg-indigo-400 text-white text-xs px-4 py-1.5 rounded font-bold h-8">Guardar</button>
                </div>
            )}

            {portfolio.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">No tienes posiciones registradas. Agrega una arriba.</div>
            ) : (
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase">
                        <tr>
                            <th className="p-4">Activo</th>
                            <th className="p-4">Cant.</th>
                            <th className="p-4">P. Compra</th>
                            <th className="p-4">P. Actual</th>
                            <th className="p-4">Ganancia/Pérdida</th>
                            <th className="p-4 text-right">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {portfolio.map(pos => {
                            const marketInfo = marketData.find(m => m.symbol === pos.symbol);
                            const currentPrice = marketInfo ? parseFloat(marketInfo.price) : pos.buyPrice;
                            const pl = (currentPrice - pos.buyPrice) * pos.qty;
                            const plPercent = ((currentPrice - pos.buyPrice) / pos.buyPrice) * 100;
                            return (
                                <tr key={pos.id} className="hover:bg-white/5">
                                    <td className="p-4 font-bold text-white">{pos.symbol}</td>
                                    <td className="p-4 text-slate-300">{pos.qty}</td>
                                    <td className="p-4 text-slate-400">${pos.buyPrice}</td>
                                    <td className="p-4 text-white font-mono">${currentPrice.toFixed(2)}</td>
                                    <td className={`p-4 font-bold ${pl >= 0 ? 'text-emerald-400' : 'text-pink-400'}`}>
                                        {pl >= 0 ? '+' : ''}{pl.toFixed(2)} USD <span className="text-[10px] opacity-70">({plPercent.toFixed(1)}%)</span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => removePosition(pos.id)} className="text-slate-600 hover:text-pink-500"><Trash2 size={16}/></button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>

        {/* --- SCANNER DE MERCADO --- */}
        {sortedData.length === 0 && !loading ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-xl">
            <Filter size={40} className="mx-auto text-slate-700 mb-4" />
            <p className="text-slate-500">No hay activos con la señal "{filterMode}".</p>
            <button onClick={() => setFilterMode('ALL')} className="text-indigo-400 text-sm mt-2 hover:underline">Ver todos</button>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {sortedData.map((stock) => (
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
                            <Tooltip text="RSI (Relative Strength Index): Mide si una acción está sobrecomprada (>70) o sobrevendida (<30).">
                                <span className="text-slate-500 font-medium flex items-center gap-1">RSI <HelpCircle size={10}/></span>
                            </Tooltip>
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
                        <th className="p-5 font-medium cursor-pointer hover:text-white flex items-center gap-1" onClick={() => handleSort('price')}>
                            Precio {sortConfig?.key === 'price' && (sortConfig.direction === 'asc' ? <ArrowUp size={12}/> : <ArrowDown size={12}/>)}
                        </th>
                        <th className="p-5 font-medium">Cambio</th>
                        <th className="p-5 font-medium cursor-pointer hover:text-white flex items-center gap-1" onClick={() => handleSort('rsi')}>
                            <Tooltip text="Menos de 30 = Barato. Más de 70 = Caro."><span>RSI</span></Tooltip> 
                            {sortConfig?.key === 'rsi' && (sortConfig.direction === 'asc' ? <ArrowUp size={12}/> : <ArrowDown size={12}/>)}
                        </th>
                        <th className="p-5 font-medium">
                            <Tooltip text="Tendencia basada en SMA (Media Móvil Simple) de 50 días."><span>Tendencia</span></Tooltip>
                        </th>
                        <th className="p-5 font-medium text-right cursor-pointer hover:text-white" onClick={() => handleSort('signal')}>
                            Señal {sortConfig?.key === 'signal' && (sortConfig.direction === 'asc' ? <ArrowUp size={12}/> : <ArrowDown size={12}/>)}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {sortedData.map((stock) => (
                        <tr key={stock.symbol} className="hover:bg-white/5 transition-colors">
                          <td className="p-5 font-bold text-white">{stock.symbol}</td>
                          <td className="p-5 font-mono text-slate-200">${stock.price}</td>
                          <td className={`p-5 font-bold ${parseFloat(stock.change) >= 0 ? 'text-emerald-400' : 'text-pink-400'}`}>{stock.change}%</td>
                          <td className="p-5"><span className="text-slate-400">{stock.rsi}</span></td>
                          <td className="p-5 text-[10px]">
                              {stock.trend === 'SUBIENDO' ? 
                                <span className="text-emerald-400 flex items-center gap-1"><TrendingUp size={12}/> ALCISTA</span> : 
                                <span className="text-pink-400 flex items-center gap-1"><TrendingDown size={12}/> BAJISTA</span>
                              }
                          </td>
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
        
        <div className="flex justify-center pt-8 opacity-40 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest">
                <Lock size={10} /> Conexión Segura v3.0 • Javi Velásquez Portal
            </div>
        </div>

      </div>
    </div>
  );
}