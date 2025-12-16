'use client'

interface CounterProps {
    value: number;
    onIncrement: () => void;
    onDecrement: () => void;
    min?: number;
    max?: number;
}

const Counter: React.FC<CounterProps> = ({
    value,
    onIncrement,
    onDecrement,
    min = 1,
    max = 999
}) => {
    return (
        <div className="inline-flex items-center gap-1 sm:gap-3 px-3 py-1 rounded border border-slate-200 max-sm:text-sm text-slate-600">
            <button
                onClick={onDecrement}
                disabled={value <= min}
                className="p-1 select-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
                -
            </button>
            <p className="p-1 min-w-[2rem] text-center">{value}</p>
            <button
                onClick={onIncrement}
                disabled={value >= max}
                className="p-1 select-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
                +
            </button>
        </div>
    )
}

export default Counter
