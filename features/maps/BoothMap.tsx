"use client";
import React, { useEffect, useState, useMemo, useCallback, useId } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Card } from '@/components/ui/Card';
import { useAppStore } from '@/store/useAppStore';
import districtsData from '@/data/maps/india-districts.json';
import boothsData from '@/data/maps/booths.json';
import { 
  MapPin, 
  Navigation, 
  Sparkles, 
  Map as MapIcon,
  Layers,
} from 'lucide-react';
import { systemOrchestrator } from '@/lib/systemOrchestrator';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

// --- Constants ---
const STATE_ID_MAP: Record<string, string> = {
  'Gujarat': 'gj', 'Maharashtra': 'mh', 'Rajasthan': 'rj', 'Karnataka': 'ka',
  'Tamil Nadu': 'tn', 'Uttar Pradesh': 'up', 'Punjab': 'pb', 'West Bengal': 'wb',
  'Kerala': 'kl', 'Bihar': 'br'
};

// --- Custom Components ---

const MapInvalidator = () => {
  const map = useMap();
  useEffect(() => {
    const timers = [100, 500, 1000, 2000].map(delay => 
      setTimeout(() => {
        map.invalidateSize();
      }, delay)
    );
    return () => timers.forEach(t => clearTimeout(t));
  }, [map]);
  return null;
};

const ZoomManager = ({ selectedDistrict }: { selectedDistrict: string | null }) => {
  const map = useMap();
  useEffect(() => {
    if (selectedDistrict) {
      const features = (districtsData as any).features || [];
      const district = features.find((f: any) => f.properties?.name === selectedDistrict);
      if (district && district.geometry?.coordinates) {
        try {
          const coords = district.geometry.coordinates[0];
          if (coords && coords[0]) {
            const firstCoord = coords[0];
            const latLng = Array.isArray(firstCoord[0]) ? [firstCoord[0][1], firstCoord[0][0]] : [firstCoord[1], firstCoord[0]];
            if (latLng[0] !== undefined && latLng[1] !== undefined) {
              map.flyTo(latLng as any, 8, { duration: 1.5 });
            }
          }
        } catch (e) {
          console.warn("Failed to zoom to district:", selectedDistrict, e);
        }
      }
    }
  }, [selectedDistrict, map]);
  return null;
};

const createCustomIcon = (color: string, isActive: boolean = false) => L.divIcon({
  html: `
    <div class="relative flex items-center justify-center">
      ${isActive ? `<div class="absolute w-12 h-12 bg-${color}-500/30 rounded-full animate-ping"></div>` : ''}
      <div class="absolute w-8 h-8 bg-${color}-500/20 rounded-full blur-sm"></div>
      <div class="relative w-5 h-5 bg-${color}-600 border-2 border-slate-900 rounded-full shadow-2xl">
        <div class="w-1.5 h-1.5 bg-white rounded-full m-auto mt-1.5"></div>
      </div>
    </div>
  `,
  className: 'custom-marker-icon',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const emeraldIcon = createCustomIcon('emerald', true);

export const BoothMap: React.FC = () => {
  const mapId = useId();
  const { logEvent } = useAppStore();
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [mapMode, setMapMode] = useState<'light' | 'dark'>('light');

  // Filtered Booths
  const filteredBooths = useMemo(() => {
    if (!selectedDistrict) return [];
    return (boothsData || []).filter(b => b.district === selectedDistrict);
  }, [selectedDistrict]);

  const handleDistrictSelection = useCallback((name: string, state: string) => {
    setSelectedDistrict(name);
    const stateId = STATE_ID_MAP[state];
    if (stateId) systemOrchestrator.onMapInteraction({ type: 'district', id: stateId, name: state });
    logEvent(`map_district_select_${name}`);
  }, [logEvent]);

  const selectionRef = React.useRef(handleDistrictSelection);
  useEffect(() => { selectionRef.current = handleDistrictSelection; }, [handleDistrictSelection]);

  const districtStyle = useCallback((feature: any) => {
    const isSelected = feature.properties.name === selectedDistrict;
    return {
      fillColor: isSelected ? '#6366F1' : 'transparent',
      weight: isSelected ? 3 : 1.5,
      opacity: 1,
      color: isSelected ? '#4F46E5' : '#64748B',
      fillOpacity: isSelected ? 0.35 : 0,
      className: 'transition-all duration-300 cursor-pointer'
    };
  }, [selectedDistrict]);

  const onDistrictClick = (e: any) => {
    const props = e.target.feature.properties;
    if (props && props.name) selectionRef.current(props.name, props.state || "");
  };

  return (
    <div className="relative w-full h-[650px] group/container">
      <div className="absolute -inset-0.5 bg-gradient-to-br from-indigo-500/20 to-emerald-500/10 rounded-[2.5rem] blur opacity-50 -z-10" />
      
      <Card className="p-0 overflow-hidden border-white/40 bg-white/70 backdrop-blur-3xl relative h-full rounded-[2.5rem] shadow-2xl">
        
        {/* MAP CONTAINER - FIXED HEIGHT AT 100% OF CARD (650px) */}
        <div className="w-full h-full relative bg-slate-100">
          <MapContainer 
            key={mapId + mapMode}
            center={[23.0225, 72.5714]} 
            zoom={5} 
            className="full-card-map"
            style={{ height: '650px', width: '100%' }}
            zoomControl={false}
          >
            <MapInvalidator />
            <ZoomManager selectedDistrict={selectedDistrict} />
            
            <TileLayer 
              url={mapMode === 'dark' 
                ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              } 
              attribution='&copy; CARTO' 
            />
            
            <GeoJSON 
              data={districtsData as any} 
              style={districtStyle} 
              onEachFeature={(feature, layer) => {
                layer.on({
                  click: onDistrictClick,
                  mouseover: (e) => e.target.setStyle({ fillOpacity: 0.6, weight: 2.5, color: '#6366F1' }),
                  mouseout: (e) => { if (e.target.feature.properties.name !== selectedDistrict) e.target.setStyle(districtStyle(e.target.feature)); }
                });
                layer.bindTooltip(`<div class="px-3 py-2 bg-white/95 rounded-xl shadow-2xl border border-white"><p class="text-[11px] font-black uppercase text-slate-900">${feature.properties.name}</p></div>`, { sticky: true });
              }} 
            />

            {filteredBooths.map((booth) => (
              <Marker key={booth.id} position={[booth.lat, booth.lng]} icon={emeraldIcon}>
                <Popup className="premium-popup">
                  <div className="p-4 min-w-[200px]">
                    <h4 className="font-black text-slate-900 text-sm mb-1">{booth.name}</h4>
                    <p className="text-[10px] text-slate-400 uppercase mb-3">{booth.district}</p>
                    <button onClick={() => systemOrchestrator.onMapInteraction({ type: 'booth', id: booth.name })} className="w-full py-2 bg-indigo-600 text-white rounded-lg text-[10px] font-black uppercase">Locate</button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* OVERLAYS */}
          <div className="absolute inset-0 z-[1000] p-6 pointer-events-none flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="bg-slate-900/90 px-4 py-2 rounded-full border border-white/10 shadow-2xl flex items-center gap-2 pointer-events-auto">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Explore Your Voting Area</span>
              </div>
              
              <div className="flex flex-col gap-3 items-end pointer-events-auto">
                <div className="bg-white/80 backdrop-blur-md p-1 rounded-xl shadow-lg border border-white flex items-center">
                  <button onClick={() => setMapMode('light')} className={cn("p-2 rounded-lg transition-all", mapMode === 'light' ? "bg-indigo-600 text-white shadow-md" : "text-slate-400")}><Sparkles size={16} /></button>
                  <button onClick={() => setMapMode('dark')} className={cn("p-2 rounded-lg transition-all", mapMode === 'dark' ? "bg-slate-900 text-white shadow-md" : "text-slate-400")}><Layers size={16} /></button>
                </div>
                
                <AnimatePresence>
                  {selectedDistrict && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white/95 p-4 rounded-2xl shadow-xl border border-white min-w-[180px]">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-2">District HUD</p>
                      <p className="text-xs font-black text-slate-900 uppercase truncate">{selectedDistrict}</p>
                      <div className="w-full h-1 bg-slate-100 rounded-full mt-2"><div className="h-full bg-indigo-600 rounded-full" style={{ width: '85%' }} /></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex justify-center">
              <AnimatePresence>
                {!selectedDistrict && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="bg-white/95 px-6 py-4 rounded-2xl shadow-2xl border border-white flex items-center gap-4 pointer-events-auto">
                    <Navigation size={20} className="text-indigo-600 animate-pulse" />
                    <div className="text-left">
                      <p className="text-[11px] font-black text-slate-900 uppercase">Tap any district</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">To view localized booth data</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Card>

      <style jsx global>{`
        .full-card-map {
          height: 650px !important;
          width: 100% !important;
          z-index: 0;
        }
        .premium-popup .leaflet-popup-content-wrapper { border-radius: 20px !important; padding: 0 !important; border: 1px solid rgba(255, 255, 255, 0.5) !important; background: rgba(255, 255, 255, 0.95) !important; }
        .premium-popup .leaflet-popup-content { margin: 0 !important; }
        .custom-marker-icon { background: transparent !important; border: none !important; }
      `}</style>
    </div>
  );
};
