// src/components/SucursalCard.tsx

import type { Sucursal } from "../types";
interface SucursalesCardProps {
  sucursal: Sucursal;
  onSelect?: (Sucursal: Sucursal) => void;
  onToggleStatus?: (Sucursal: Sucursal) => void;
}
const statusConfig = {
  active: { bg: "bg-green-100", text: "text-green-800", label: "Activo" },
  inactive: { bg: "bg-red-100", text: "text-red-800", label: "Inactivo" },
};
function SucursalCard({
  sucursal,
  onSelect,
  onToggleStatus,
}: SucursalesCardProps) {
   const { name, encargado, cantidad_empleados, estado } = sucursal;
  const statusStyle = statusConfig[estado];
  return (
    <div
      onClick={() => onSelect?.(sucursal)}
      className={`
bg-white rounded-xl border border-slate-200 p-5 w-full
hover:shadow-md hover:border-blue-300
transition-all duration-200
${onSelect ? "cursor-pointer" : ""}
`}
    >
      <div className="flex items-center gap-3">
        
        <div
          className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden text-blue-700 font-semibold 
text-lg flex-shrink-0"
        >
         
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-slate-900 truncate">{name}</h3>
          <p className="text-sm text-slate-500 truncate">{encargado}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2">
        <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium truncate">
          {cantidad_empleados} Empleados
        </span>
        <span
          onClick={(e) => {
            e.stopPropagation();
            onToggleStatus?.(sucursal);
          }}
          title={onToggleStatus ? "Clic para cambiar el estado" : undefined}
          className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyle.bg} ${statusStyle.text} ${
            onToggleStatus ? "cursor-pointer hover:opacity-75" : ""
          }`}
        >
          {statusStyle.label}
        </span>
      </div>
    </div>
  );
}

export default SucursalCard;
