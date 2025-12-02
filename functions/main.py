from firebase_functions import https_fn
from firebase_admin import initialize_app
import yfinance as yf
import json

initialize_app()

@https_fn.on_request()
def marketScanner(req: https_fn.Request) -> https_fn.Response:
    # 1. Configuración de Seguridad (CORS)
    if req.method == 'OPTIONS':
        return https_fn.Response("", status=204, headers={
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type'
        })

    # 2. Leer activos solicitados desde React
    req_json = req.get_json(silent=True)
    assets_to_scan = req_json.get('assets', []) if req_json else []

    results = []
    
    # 3. Escanear Bolsa (Yahoo Finance)
    for asset in assets_to_scan:
        try:
            symbol = asset['symbol']
            ticker = yf.Ticker(symbol)
            
            # Historial de 3 meses para análisis técnico
            hist = ticker.history(period="3mo")
            if hist.empty:
                continue

            current_price = hist['Close'].iloc[-1]
            
            # Cálculo de RSI (Indicador de Fuerza Relativa)
            # RSI < 30: Barato (Compra) | RSI > 70: Caro (Venta)
            delta = hist['Close'].diff()
            gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
            loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
            rs = gain / loss
            rsi = 100 - (100 / (1 + rs))
            current_rsi = rsi.iloc[-1]

            # Cálculo de SMA (Tendencia a 50 días)
            sma_50 = hist['Close'].rolling(window=50).mean().iloc[-1]
            
            # LÓGICA DE SEÑALES (El corazón del sistema)
            signal_data = { "action": "MANTENER", "color": "text-slate-400 border-slate-700 bg-slate-800", "reason": "NEUTRAL" }
            
            if current_rsi < 30:
                signal_data = { "action": "COMPRAR", "color": "text-indigo-300 border-indigo-500 bg-indigo-500/20", "reason": "SOBREVENTA (BARATO)" }
            elif current_rsi > 70:
                signal_data = { "action": "VENDER", "color": "text-pink-300 border-pink-500 bg-pink-500/20", "reason": "SOBRECOMPRA (CARO)" }
            elif current_price > sma_50 and 45 <= current_rsi <= 65:
                signal_data = { "action": "ACUMULAR", "color": "text-emerald-300 border-emerald-500 bg-emerald-500/20", "reason": "TENDENCIA ALCISTA" }

            results.append({
                **asset,
                "price": f"{current_price:.2f}",
                "change": f"{((current_price - hist['Close'].iloc[-2]) / hist['Close'].iloc[-2] * 100):.2f}",
                "rsi": int(current_rsi),
                "trend": "SUBIENDO" if current_price > sma_50 else "BAJANDO",
                "signal": signal_data
            })

        except Exception as e:
            print(f"Error procesando {asset['symbol']}: {str(e)}")

    # 4. Responder al Frontend (Ya no enviamos saldo fintual desde aquí)
    return https_fn.Response(
        json.dumps({ "stocks": results }),
        headers={
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        }
    )