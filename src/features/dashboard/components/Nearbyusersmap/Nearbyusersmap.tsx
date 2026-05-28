import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './NearbyUsersMap.css';
import { useAppSelector } from '../../../../shared/hooks/useAuth';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface UserInfo {
  userId: number;
  username: string;
  avatarUrl?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  level: number;
  isPremium: boolean;
}

interface UserWithCoords extends UserInfo {
  lat: number;
  lng: number;
}

const API_URL = `${import.meta.env.VITE_API_URL ?? 'https://bokadoserver-production.up.railway.app'}/api/users`;

const geocodeCity = async (city: string): Promise<{ lat: number; lng: number } | null> => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`
    );
    const data = await res.json();
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
  } catch {}
  return null;
};

const createUserIcon = (isPremium: boolean) =>
  L.divIcon({
    className: '',
    html: `<div class="map-marker ${isPremium ? 'map-marker--premium' : ''}">
      <div class="map-marker__dot"></div>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -34],
  });

const createMeIcon = () =>
  L.divIcon({
    className: '',
    html: `<div class="map-marker map-marker--me">
      <div class="map-marker__dot"></div>
      <div class="map-marker__pulse"></div>
    </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -42],
  });

const NearbyUsersMap: React.FC = () => {
  const { user, token } = useAppSelector((s) => s.auth);
  const currentUsername = user?.username;

  const [users, setUsers] = useState<UserWithCoords[]>([]);
  const [myCoords, setMyCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/by-city`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data: UserInfo[] = await res.json();

        const withCoords: UserWithCoords[] = [];
        const cityCache: Record<string, { lat: number; lng: number } | null> = {};

        for (const u of data.slice(0, 20)) {
          // Якщо є точні координати — використовуємо їх
          if (u.latitude && u.longitude) {
            withCoords.push({
              ...u,
              lat: u.latitude + (Math.random() - 0.5) * 0.001,
              lng: u.longitude + (Math.random() - 0.5) * 0.001,
            });
          } else if (u.city) {
            // Інакше геокодуємо місто
            if (!(u.city in cityCache)) {
              cityCache[u.city] = await geocodeCity(u.city);
              await new Promise(r => setTimeout(r, 100));
            }
            const coords = cityCache[u.city];
            if (coords) {
              withCoords.push({
                ...u,
                lat: coords.lat + (Math.random() - 0.5) * 0.02,
                lng: coords.lng + (Math.random() - 0.5) * 0.02,
              });
            }
          }
        }

        setUsers(withCoords);

        // Координати поточного юзера
        const me = data.find(u => u.username === currentUsername);
        if (me?.latitude && me?.longitude) {
          setMyCoords({ lat: me.latitude, lng: me.longitude });
        } else if (me?.city) {
          const coords = cityCache[me.city] ?? await geocodeCity(me.city);
          setMyCoords(coords);
        }
      } catch (err) {
        console.error('🗺️ error:', err);
        setError('Не вдалося завантажити карту');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token, currentUsername]);

  const center = myCoords ?? { lat: 49.0, lng: 32.0 };

  if (loading) {
    return (
      <div className="nmap__loading">
        <div className="nmap__spinner" />
        <span>Завантажуємо карту користувачів...</span>
      </div>
    );
  }

  if (error) {
    return <div className="nmap__error">⚠️ {error}</div>;
  }

  return (
    <div className="nmap">
      <div className="nmap__head">
        <h3 className="nmap__title">🗺️ Користувачі поруч</h3>
        <span className="nmap__count">{users.length} на карті</span>
      </div>

      <div className="nmap__map-wrap">
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={myCoords ? 12 : 6}
          className="nmap__map"
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {myCoords && (
            <Circle
              center={[myCoords.lat, myCoords.lng]}
              radius={5000}
              pathOptions={{ color: '#7C4DFF', fillColor: '#7C4DFF', fillOpacity: 0.06, weight: 1.5 }}
            />
          )}

          {myCoords && (
            <Marker position={[myCoords.lat, myCoords.lng]} icon={createMeIcon()}>
              <Popup>
                <div className="nmap__popup">
                  <strong>👤 {currentUsername}</strong>
                  <span>Це ти!</span>
                </div>
              </Popup>
            </Marker>
          )}

          {users
            .filter(u => u.username !== currentUsername)
            .map(u => (
              <Marker
                key={u.userId}
                position={[u.lat, u.lng]}
                icon={createUserIcon(u.isPremium)}
              >
                <Popup>
                  <div className="nmap__popup">
                    {u.avatarUrl && (
                      <img src={u.avatarUrl} alt={u.username} className="nmap__popup-avatar" />
                    )}
                    <div className="nmap__popup-info">
                      <strong>{u.username}</strong>
                      {u.isPremium && <span className="nmap__popup-premium">⭐ Premium</span>}
                      <span>📍 {u.city}</span>
                      <span>⚡ Рівень {u.level}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default NearbyUsersMap;