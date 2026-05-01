"use client";
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Card } from '@/components/ui/Card';
import { useAppStore } from '@/store/useAppStore';
import districtsData from '@/data/maps/india-districts.json';
import boothsData from '@/data/maps/booths.json';
import { MapPin, Navigation, Info } from 'lucide-react';
import { systemOrchestrator } from '@/lib/systemOrchestrator';
import { Link } from '@/i18n/navigation';

// Fix for Leaflet default icon issue
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export const BoothMap: React.FC = () => {
  const { toggleStep, incrementEngagement, logEvent } = useAppStore();
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  const STATE_ID_MAP: Record<string, string> = {
    'Gujarat': 'gj',
    'Maharashtra': 'mh',
    'Rajasthan': 'rj',
    'Karnataka': 'ka',
    'Tamil Nadu': 'tn',
    'Uttar Pradesh': 'up',
    'Punjab': 'pb',
    'West Bengal': 'wb',
    'Kerala': 'kl',
    'Bihar': 'br'
  };

  const districtStyle = (feature: any) => ({
    fillColor: feature.properties.name === selectedDistrict ? '#3b82f6' : '#f8fafc',
    weight: 2,
    opacity: 1,
    color: feature.properties.name === selectedDistrict ? '#2563eb' : '#cbd5e1',
    fillOpacity: feature.properties.name === selectedDistrict ? 0.3 : 1,
    className: 'district-polygon' // For CSS pointer
  });

  const onDistrictClick = (e: any) => {
    const layer = e.target;
    const districtName = layer.feature.properties.name;
    const stateName = layer.feature.properties.state;
    logEvent(`map_click_${districtName}_${stateName}`);
    
    setSelectedDistrict(districtName);
    
    // Orchestrate state unlock and engagement via central system
    const stateId = STATE_ID_MAP[stateName];
    if (stateId) {
      systemOrchestrator.onMapInteraction({ type: 'district', id: stateId, name: stateName });
    }

    // Animation feedback
    layer.setStyle({
      fillColor: '#10b981', // Success green
      fillOpacity: 0.5,
      weight: 3
    });
    
    setTimeout(() => {
      layer.setStyle(districtStyle(layer.feature));
    }, 1000);
  };

  const onMouseOver = (e: any) => {
    const layer = e.target;
    layer.setStyle({
      fillColor: '#3b82f6',
      fillOpacity: 0.2,
      weight: 2,
      color: '#2563eb'
    });
  };

  const onMouseOut = (e: any) => {
    const layer = e.target;
    if (layer.feature.properties.name !== selectedDistrict) {
      layer.setStyle(districtStyle(layer.feature));
    }
  };

  const handleLocateBooth = (boothName: string) => {
    systemOrchestrator.onMapInteraction({ type: 'booth', id: boothName });
  };

  return (
    <Card className="p-0 overflow-hidden border-none shadow-2xl shadow-slate-200 bg-white relative h-[500px]">
      {/* Top Left: Selection Info */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
        <div className="px-4 py-2 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3">
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-3">
              <Navigation size={14} className="text-blue-600 animate-pulse" />
              {selectedDistrict || "Select a District"}
            </p>
            {selectedDistrict && (
              <Link 
                href="/insights" 
                className="ml-2 pl-3 border-l border-slate-200 text-[10px] font-black text-primary uppercase tracking-wider hover:text-blue-700 transition-colors"
              >
                View Insights
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Center: Guide/Instruction */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-[320px]">
        <div className="px-5 py-3 bg-slate-900/90 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center shrink-0">
            <Info size={20} className="text-emerald-500" />
          </div>
          <div>
            <p className="text-white text-[10px] font-black uppercase tracking-widest leading-none mb-1">State Collectibles</p>
            <p className="text-slate-400 text-[9px] font-bold leading-tight">Tap any region boundary to collect its exclusive state sticker.</p>
          </div>
        </div>
      </div>

      <MapContainer 
        center={[23.0225, 72.5714]} 
        zoom={5} 
        style={{ height: '100%', width: '100%', background: '#f1f5f9' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        <GeoJSON 
          data={districtsData as any} 
          style={districtStyle}
          onEachFeature={(feature, layer) => {
            layer.on({
              click: onDistrictClick,
              mouseover: onMouseOver,
              mouseout: onMouseOut
            });
            layer.bindTooltip(`
              <div class="space-y-0.5">
                <p class="text-[8px] opacity-60 font-black uppercase">${feature.properties.state}</p>
                <p class="text-[10px] font-black uppercase tracking-wider">${feature.properties.name}</p>
                <p class="text-[7px] text-emerald-400 font-bold uppercase mt-1">Click to Collect Sticker</p>
              </div>
            `, { sticky: true, className: 'custom-tooltip' });
          }}
        />

        {boothsData.map((booth) => (
          <Marker 
            key={booth.id} 
            position={[booth.lat, booth.lng]}
          >
            <Popup className="custom-popup">
              <div className="p-3 min-w-[180px] space-y-3">
                <div className="space-y-1">
                  <h4 className="font-black text-slate-900 text-sm leading-tight">{booth.name}</h4>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <MapPin size={10} /> {booth.district}, {booth.state}
                  </p>
                </div>
                <button 
                  onClick={() => handleLocateBooth(booth.name)}
                  className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
                >
                  Locate & Mark Ready
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <style jsx global>{`
        .district-polygon {
          cursor: pointer !important;
          outline: none !important;
        }
        .custom-tooltip {
          background: #0f172a !important;
          border: none !important;
          color: white !important;
          font-family: inherit !important;
          padding: 8px 12px !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1) !important;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 20px !important;
          padding: 0 !important;
          overflow: hidden !important;
          box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25) !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
        }
        .leaflet-container {
          font-family: inherit !important;
        }
      `}</style>
    </Card>
  );
};
