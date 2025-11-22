'use client';

import React from 'react';
import Image from 'next/image';

export function QuantumLoader() {
  const logoUrl = 'https://firebasestorage.googleapis.com/v0/b/velsquez-digital.firebasestorage.app/o/Private%2Flogo-javier.svg?alt=media&token=7d179ca6-55ad-4a5f-9cf6-e6050f004630';

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <div className="relative flex items-center justify-center">
        
        {/* 1. Glow de fondo difuminado (Ambiente) */}
        <div className="absolute w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        
        {/* Logo en el centro */}
        <div className="absolute z-10">
            <Image
                src={logoUrl}
                alt="Logo Loader"
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
            />
        </div>

        {/* 2. Anillo Exterior (Gira lento) */}
        <div 
          className="w-32 h-32 rounded-full border border-white/5 border-t-indigo-500 animate-spin-slow shadow-[0_0_25px_rgba(99,102,241,0.2)]"
        ></div>
        
        {/* 3. Anillo Interior (Gira rápido en sentido contrario) */}
        <div 
          className="absolute w-24 h-24 rounded-full border border-white/5 border-b-purple-500 animate-spin" 
          style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
        ></div>
        
        {/* 4. Núcleo Central (Efecto de respiración) */}
        <div className="absolute w-4 h-4 bg-white rounded-full animate-ping opacity-20"></div>
      </div>
      
      {/* Texto de carga (Opcional) */}
      <div className="mt-12 text-center">
        <p className="text-lg font-medium text-foreground tracking-widest uppercase animate-pulse-text">Cargando</p>
        <p className="text-xs text-indigo-400 mt-1 font-mono">Inicializando sistemas...</p>
      </div>
    </div>
  );
}
