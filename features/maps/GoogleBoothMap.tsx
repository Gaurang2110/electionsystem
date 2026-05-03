"use client";
import React, { useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import boothsData from '@/data/maps/booths.json';
import { Navigation } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '650px'
};

const center = {
  lat: 20.5937,
  lng: 78.9629
};

const googleMapStyles = [
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "poi",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "transit",
    "stylers": [{ "visibility": "off" }]
  }
];

export const GoogleBoothMap: React.FC = () => {
  const [selectedBooth, setSelectedBooth] = React.useState<any>(null);
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  });

  const markers = useMemo(() => {
    return (boothsData || []).map(booth => ({
      ...booth,
      position: { lat: booth.lat, lng: booth.lng },
    }));
  }, []);

  if (!isLoaded) {
    return (
      <div className="w-full h-[650px] bg-slate-100 rounded-[2.5rem] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Initializing Google Maps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/40">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={5}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          styles: googleMapStyles
        }}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            title={marker.name}
            onClick={() => setSelectedBooth(marker)}
          />
        ))}

        {selectedBooth && (
          <InfoWindow
            position={selectedBooth.position}
            onCloseClick={() => setSelectedBooth(null)}
          >
            <div className="p-2 min-w-[150px]">
              <h4 className="font-bold text-slate-900 text-xs mb-1">{selectedBooth.name}</h4>
              <p className="text-[10px] text-slate-400 uppercase mb-2">{selectedBooth.district}</p>
              <button 
                onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedBooth.lat},${selectedBooth.lng}`, '_blank')}
                className="w-full py-1.5 bg-indigo-600 text-white rounded-lg text-[9px] font-black uppercase tracking-tight flex items-center justify-center gap-1"
              >
                <Navigation size={10} />
                Navigate
              </button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};
