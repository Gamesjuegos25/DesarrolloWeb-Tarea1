// src/components/StatsBadge.tsx
interface StatsBadgeProps {
  label: string;
  value: number;
  variant: 'blue' | 'green' | 'yellow' | 'red';
}

const variantStyles: Record<StatsBadgeProps['variant'], string> = {
  blue: 'border-blue-200 text-blue-700',
  green: 'border-green-200 text-green-700',
  yellow: 'border-yellow-200 text-yellow-700',
  red: 'border-red-200 text-red-700',
};

function StatsBadge({ label, value, variant }: StatsBadgeProps) {
  return (
    <div
      className={`border-2 rounded-lg p-4 min-w-[180px] text-center bg-white shadow-sm ${variantStyles[variant]}`}
    >
      <div className="text-2xl font-bold">
        {value}
      </div>
      <div className="text-sm text-slate-500 mt-1">
        {label}
      </div>
    </div>
  );
}

export default StatsBadge;