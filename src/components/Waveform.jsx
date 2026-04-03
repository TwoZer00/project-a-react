import { useTheme } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const BAR_WIDTH = 3;
const BAR_GAP = 1;

export default function Waveform({ audioUrl, progress, onSeek }) {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [peaks, setPeaks] = useState([]);
    const theme = useTheme();

    useEffect(() => {
        if (!audioUrl) return;
        let cancelled = false;
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        fetch(audioUrl)
            .then(res => res.arrayBuffer())
            .then(buf => ctx.decodeAudioData(buf))
            .then(decoded => {
                if (cancelled) return;
                const raw = decoded.getChannelData(0);
                const width = containerRef.current?.clientWidth || 200;
                const barCount = Math.floor(width / (BAR_WIDTH + BAR_GAP));
                const blockSize = Math.floor(raw.length / barCount);
                const samples = [];
                for (let i = 0; i < barCount; i++) {
                    let sum = 0;
                    for (let j = 0; j < blockSize; j++) {
                        sum += Math.abs(raw[i * blockSize + j]);
                    }
                    samples.push(sum / blockSize);
                }
                const max = Math.max(...samples) || 1;
                setPeaks(samples.map(s => s / max));
            })
            .catch(() => {})
            .finally(() => ctx.close());
        return () => { cancelled = true; };
    }, [audioUrl]);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || peaks.length === 0) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, width, height);

        const playedColor = theme.palette.primary.main;
        const unplayedColor = theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.15)';
        const progressX = (progress / 100) * width;

        peaks.forEach((peak, i) => {
            const x = i * (BAR_WIDTH + BAR_GAP);
            const barHeight = Math.max(2, peak * height);
            const y = (height - barHeight) / 2;
            ctx.fillStyle = x < progressX ? playedColor : unplayedColor;
            ctx.beginPath();
            ctx.roundRect(x, y, BAR_WIDTH, barHeight, 1);
            ctx.fill();
        });
    }, [peaks, progress, theme]);

    useEffect(() => { draw(); }, [draw]);

    const handleClick = (e) => {
        if (!onSeek || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const pct = ((e.clientX - rect.left) / rect.width) * 100;
        onSeek(Math.min(100, Math.max(0, pct)));
    };

    return (
        <div
            ref={containerRef}
            onClick={handleClick}
            style={{ width: '100%', height: 48, cursor: 'pointer' }}
        >
            <canvas ref={canvasRef} style={{ display: 'block' }} />
        </div>
    );
}
