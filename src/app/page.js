'use client';

import { useEffect } from 'react';
import './globals.css';

export default function Page() {
  useEffect(() => {
    const input = document.getElementById('chatInput');
    const stream = document.getElementById('chatMessages');

    if (!input || !stream) return;

    input.addEventListener('keypress', async (e) => {
      if (e.key !== 'Enter') return;
      const text = input.value.trim();
      if (!text) return;

      addMsg(`You: ${text}`);
      input.value = '';
      input.disabled = true;

      try {
        const res = await fetch('https://johnliucodes.app.n8n.cloud/webhook/stock-sensai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, sessionId: 'user123' }),
        });
        const data = await res.json();
        addMsg(`Sensai: ${data.response || 'No response.'}`);
      } catch (err) {
        addMsg('⚠️ Error contacting Stock Sensai.');
      } finally {
        input.disabled = false;
        input.focus();
      }
    });

    input.focus();

    function roleFromPrefix(text) {
      if (text.startsWith('You:')) return 'user';
      if (text.startsWith('Sensai:')) return 'bot';
      return 'bot';
    }

    function addMsg(raw) {
      const role = roleFromPrefix(raw);
      let msg = raw.replace(/^You:\s?|^Sensai:\s?/i, '');

      const formatted = msg
        .replace(/!\[[^\]]*]\((https:\/\/[^\s)]+)\)/g,
          (_, url) => `
          <span class="chart-wrap">
            <img src="${url}">
            <span class="zoom-icon" onclick="window.open('${url}', '_blank')">🔍</span>
          </span>`)
        .replace(/https:\/\/[^\s)]+/g, url => {
          if (url.includes('chart-img.com')) {
            return `
            <span class="chart-wrap">
              <img src="${url}">
              <span class="zoom-icon" onclick="window.open('${url}', '_blank')">🔍</span>
            </span>`;
          }
          return `<a href="${url}" target="_blank">${url}</a>`;
        })
        .replace(/\n/g, '<br>')
        .replace(/(^|<br>)([^<]+?):<br>/g, (_, br, hdr) => `${br}<strong>${hdr}:</strong><br>`)
        .replace(/(^|<br>)(\d+\.\s[^:]+:)/g, (_, br, hdr) => `${br}<strong>${hdr}</strong>`)
        .replace(/(Key Findings|Primary Drivers & Catalysts):/gi, '<strong>$1:</strong>');

      const div = document.createElement('div');
      div.className = `message ${role}`;
      div.innerHTML = formatted;
      stream.appendChild(div);
      stream.scrollTop = stream.scrollHeight;
    }
  }, []);

  return (
    <>
      <div className="top-banner">
        <div className="banner-content">
          <span className="banner-msg">Struggling to read candlestick charts?</span>
          <button className="banner-btn">Fix Now</button>
        </div>
        <span className="banner-close">✕</span>
      </div>

      <header className="nav">
        <span className="brand">StockSensai</span>
        <nav className="nav-links">
          <a href="#">About</a>
          <a href="#">Resources</a>
          <a href="#">Codebase</a>
          <a href="#">Saved Chats</a>
        </nav>
        <div className="hamburger">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </header>

      <section className="hero">
        <div className="hero-text">
          <h1>Master the Market with <strong>StockSensai</strong>.</h1>
          <p>
            StockSensai is your agentic-AI copilot for decoding markets in real time. Powered by <strong>chart-img</strong> and <strong>Tavily</strong> APIs, we translate candlestick chaos and sentiment streams into crystal-clear alpha. Cut through the charts. Strike with precision.
          </p>
          <p><strong>Built for traders. Driven by automation. Fueled by intelligence.</strong></p>
          <button className="cta" onClick={() => document.getElementById('examples-section').scrollIntoView({ behavior: 'smooth' })}>Try&nbsp;Now</button>
        </div>
        <div className="hero-img">
          <img src="/Landing.png" alt="StockSnap hero graphic" />
        </div>
      </section>

      <div className="info-card">
        <h3>📈 Today in the Market [6/28/2025]</h3>
        <ul>
          <li><strong>S&P 500 Prints New ATH:</strong> Index closed +1.2% at 5,350, powered by a 4% surge in semiconductor mega-caps. <span style={{ color: 'rgb(28, 217, 88)', cursor: 'pointer' }}>Read more →</span></li>
          <li><strong>Fed-Funds Curve Shifts:</strong> Futures now price ≈ 46 bps of easing by Dec-25; the 10-yr Treasury yield slipped 4 bps to 4.18%. <span style={{ color: 'rgb(28, 217, 88)', cursor: 'pointer' }}>Read more →</span></li>
          <li><strong>USD Softens:</strong> DXY fell 0.3% after flash PMI missed consensus (52.4 vs 53.1), hinting at moderating growth momentum. <span style={{ color: 'rgb(211, 178, 47)' }}>Read more →</span></li>
          <li><strong>WTI Crude +2.7%:</strong> Futures settled at $82.30/bbl on a 5.4 Mbbl EIA draw and renewed Mid-East supply risk. <span style={{ color: 'rgb(211, 178, 47)' }}>Read more →</span></li>
          <li><strong>Crypto Bid Returns:</strong> Bitcoin rebounded 4.5% to $67.2k as spot-ETF inflows hit a 3-week high of $560m. <span style={{ color: 'rgb(28, 217, 88)', cursor: 'pointer' }}>Read more →</span></li>
          <li><strong>Volatility Compression:</strong> VIX closed at 11.9 (-0.8), with 1-month equity skew near 12-month lows—signalling rising complacency. <span style={{ color: 'rgb(211, 178, 47)' }}>Read more →</span></li>
        </ul>
      </div>

      <main className="main">
        <section id="examples-section" className="examples">
          <h2>📝 Prompt Examples</h2>
          <ul>
            <li>[Enter Stock Ticker] for technical + sentiment overview. EX: "TSLA"</li>
            <li>"What is the stock symbol for Meta?"</li>
            <li>"What are the highest performing companies in NASDAQ?"</li>
            <li>“Compare AAPL vs MSFT”</li>
            <li>“Estimate month that AMD drops 5%”</li>
            <li>"As a college student with $2k in savings, what type of stocks should I invest in and how?"</li>
          </ul>
        </section>

        <div className="chat">
          <div id="chatMessages" className="stream"></div>
          <img src="/ChatLogo.png" className="chat-overlay" alt="Decorative overlay" />
          <div className="input-bar">
            <input id="chatInput" type="text" placeholder="Enter stock ticker to retrieve real-time analysis..." />
          </div>
        </div>
      </main>
    </>
  );
}
