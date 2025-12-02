import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  icon: LucideIcon;
  colorClass?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, trend, trendUp, icon: Icon, colorClass = "bg-blue-500" }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between transition-all hover:shadow-md">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        {trend && (
          <p className={`text-xs font-medium mt-2 flex items-center ${trendUp ? 'text-emerald-600' : 'text-red-500'}`}>
            {trendUp ? '↑' : '↓'} {trend}
            <span className="text-slate-400 ml-1 font-normal">vs mês anterior</span>
          </p>
        )}
      </div>
      <div className={`p-3 rounded-lg text-white ${colorClass}`}>
        <Icon size={24} />
      </div>
    </div>
  );
};
