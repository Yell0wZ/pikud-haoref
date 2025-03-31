import React from 'react';
import { FileText } from 'lucide-react';
import { materialsData } from './materialsData';

export const MaterialsView: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-black mb-2">Files & Materials</h2>
      
      <div className="space-y-3">
        {materialsData.map((category, index) => (
          <div 
            key={index}
            className="bg-white/80 backdrop-blur-sm border border-orange-200 p-4 rounded-xl shadow cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-orange-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-black">{category}</h3>
                <p className="text-xs text-black/70">View files</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaterialsView;