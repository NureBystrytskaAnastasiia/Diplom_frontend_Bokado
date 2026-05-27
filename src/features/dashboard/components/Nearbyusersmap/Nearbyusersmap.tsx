import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './NearbyUsersMap.css';

// Фікс для іконок Leaflet у Vite
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

interface Props {
  currentUserCity?: string;
  currentUsername?: string;
  token?: string;
}

const NearbyUsersMap: React.FC<Props> = ({ currentUserCity, currentUsername, token }) => {
  const [users, setUsers] = useState<UserWithCoords[]>([]);
  const [myCoords, setMyCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        // Завантажуємо юзерів з бекенду
        const res = await fetch(`${API_URL}/by-city`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data: UserInfo[] = await res.json();

        // Геокодуємо міста з затримкою щоб не перевантажити Nominatim
        const withCoords: UserWithCoords[] = [];
        const cityCache: Record<string, { lat: number; lng: number } | null> = {};

        for (const user of data) {
          if (!user.city) continue;
          if (!(user.city in cityCache)) {
            cityCache[user.city] = await geocodeCity(user.city);
            await new Promise(r => setTimeout(r, 300)); // затримка 300мс
          }
          const coords = cityCache[user.city];
          if (coords) {
            // Трохи розкидаємо маркери щоб не злипались
            withCoords.push({
              ...user,
              lat: coords.lat + (Math.random() - 0.5) * 0.02,
              lng: coords.lng + (Math.random() - 0.5) * 0.02,
            });
          }
        }

        setUsers(withCoords);

        // Координати поточного юзера
        if (currentUserCity) {
          const coords = cityCache[currentUserCity] ?? await geocodeCity(currentUserCity);
          setMyCoords(coords);
        }
      } catch {
        setError('Не вдалося завантажити карту');
      } finally {
        setLoading(false);
      }
    };

    if (token) load();
  }, [token, currentUserCity]);

  const center = myCoords ?? { lat: 49.0, lng: 32.0 }; // Центр України за замовчуванням

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
          zoom={myCoords ? 10 : 6}
          className="nmap__map"
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {/* Коло навколо поточного юзера */}
          {myCoords && (
            <Circle
              center={[myCoords.lat, myCoords.lng]}
              radius={30000}
              pathOptions={{ color: '#7C4DFF', fillColor: '#7C4DFF', fillOpacity: 0.06, weight: 1.5 }}
            />
          )}

          {/* Маркер поточного юзера */}
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

          {/* Маркери інших юзерів */}
          {users
            .filter(u => u.username !== currentUsername)
            .map(user => (
              <Marker
                key={user.userId}
                position={[user.lat, user.lng]}
                icon={createUserIcon(user.isPremium)}
              >
                <Popup>
                  <div className="nmap__popup">
                    {user.avatarUrl && (
                      <img src={user.avatarUrl} alt={user.username} className="nmap__popup-avatar" />
                    )}
                    <div className="nmap__popup-info">
                      <strong>{user.username}</strong>
                      {user.isPremium && <span className="nmap__popup-premium">⭐ Premium</span>}
                      <span>📍 {user.city}</span>
                      <span>⚡ Рівень {user.level}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>

      {!currentUserCity && (
        <p className="nmap__hint">💡 Вкажи своє місто в профілі щоб бачити людей поруч</p>
      )}
    </div>
  );
};

export default NearbyUsersMap;