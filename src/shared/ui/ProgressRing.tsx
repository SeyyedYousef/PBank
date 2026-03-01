interface ProgressRingProps {
    percent: number;
    size: number;
    stroke: number;
    color: string;
    children?: React.ReactNode;
}

export const ProgressRing = ({ percent, size, stroke, color, children }: ProgressRingProps) => {
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const offset = c - (percent / 100) * c;
    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="progress-ring">
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
                <circle
                    cx={size / 2} cy={size / 2} r={r} fill="none"
                    stroke={color} strokeWidth={stroke}
                    strokeDasharray={c} strokeDashoffset={offset}
                    className="progress-ring-circle"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                {children}
            </div>
        </div>
    );
};
