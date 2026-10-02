import React, { useMemo } from 'react';
import { MapContainer, CircleMarker, Popup, TileLayer, useMap } from 'react-leaflet';
import type { RecyclingRequest, Partner } from '@/lib/types';
import { CONDITION_COLORS } from '@/lib/constants';
import { formatKg } from '@/lib/impact';

// Fix for default icon issue - using CircleMarker instead

interface MapProps {
  requests: RecyclingRequest[];
  partners?: Partner[];
  height?: string;
  showPartners?: boolean;
  onMarkerClick?: (req: RecyclingRequest) => void;
  center?: [number, number];
  zoom?: number;
}

function MapBounds({ center }: { center: [number, number] }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, 12);
  }, [center, map]);
  return null;
}

export function RequestMap({ requests, partners = [], height = '400px', showPartners = false, onMarkerClick, center = [17.4401, 78.3489], zoom = 12 }: MapProps) {
  const markers = useMemo(() => requests, [requests]);

  return (
    <div style={{ height }} className="rounded-2xl overflow-hidden border border-sage/20 z-0">
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <MapBounds center={center} />
        {markers.map((req) => (
          <CircleMarker
            key={req.id}
            center={[req.lat, req.lng]}
            radius={8}
            pathOptions={{
              color: CONDITION_COLORS[req.condition],
              fillColor: CONDITION_COLORS[req.condition],
              fillOpacity: 0.7,
              weight: 2,
            }}
            eventHandlers={{
              click: () => onMarkerClick?.(req),
            }}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-semibold mb-1">{req.trackingCode}</div>
                <div>{req.material} · {req.condition}</div>
                <div>{formatKg(req.weightKg)}</div>
                <div className="text-xs text-gray-500 mt-1">{req.locality}</div>
                <div className="text-xs text-gray-500">Status: {req.status}</div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
        {showPartners && partners.map((p) => (
          <CircleMarker
            key={p.id}
            center={[p.lat, p.lng]}
            radius={10}
            pathOptions={{
              color: '#2B2B2B',
              fillColor: '#2B2B2B',
              fillOpacity: 0.5,
              weight: 3,
              dashArray: '4 2',
            }}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">{p.name}</div>
                <div className="text-xs">{p.type} · {p.locality}</div>
                <div className="text-xs">Accepts: {p.acceptedMaterials.join(', ')}</div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
