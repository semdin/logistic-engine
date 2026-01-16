# 📚 Logistic Engine - Ders Notları

Bu dosya, projenin geliştirilmesi sırasında öğrenilen kavramları içerir.

---

## Ders 1: Docker Ekosistemi ve Temel Kavramlar

### Docker Nedir?

Docker, uygulamaları **konteyner** adı verilen izole ortamlarda çalıştıran bir platformdur.

```
┌─────────────────────────────────────┐
│         Senin Bilgisayarın          │
├─────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│ │ PG 17   │ │ Redis 8 │ │ Node 22 │ │
│ │Container│ │Container│ │Container│ │
│ └─────────┘ └─────────┘ └─────────┘ │
└─────────────────────────────────────┘
✅ Her servis izole
✅ Kolayca silinebilir
✅ Aynı ortam her yerde
```

### Container (Konteyner) Nedir?

Container = **Mini sanal makine** ama çok daha hafif!

| Özellik | Virtual Machine | Container |
|---------|-----------------|-----------|
| **Boyut** | GB'larca | MB'larca |
| **Başlama süresi** | Dakikalar | Saniyeler |
| **İzolasyon** | Tam (ayrı OS) | Kısmi (paylaşımlı kernel) |
| **Kaynak kullanımı** | Yüksek | Düşük |

**Analoji:**
- **VM** = Her daire için ayrı bina yapmak 🏢
- **Container** = Aynı binada ayrı daireler 🏠

### Volume Nedir?

Container'lar **geçici**dir. Sildiğinde içindeki veriler de gider. **Volume**, verileri **kalıcı** yapar.

```
Volume KULLANILDIĞINDA:
┌─────────────────┐
│   Container     │  ──────> 💨 Uçabilir
│  (PostgreSQL)   │
│   /var/lib/ ────┼──────┐
└─────────────────┘      │
                         ▼
              ┌──────────────────┐
              │     VOLUME       │  ──────> 💾 Kalıcı!
              │  postgres_data   │
              └──────────────────┘
```

**docker-compose.yml'deki örnek:**
```yaml
volumes:
  - postgres_data:/var/lib/postgresql/data
#   ^^^^^^^^^^^^^ ^^^^^^^^^^^^^^^^^^^^^^^^
#   Volume adı    Container içindeki yol
```

### Docker Compose Nedir?

Birden fazla container'ı **tek bir dosyayla** yönetmeyi sağlar.

```bash
# Tek komut, hepsi ayağa kalkar
docker compose up -d
```

**docker-compose.yml = Orkestra Notası 🎵**
```yaml
services:
  postgres:    # 🎸 Veritabanı
    image: ...
  redis:       # 🥁 Cache
    image: ...
  app:         # 🎤 Uygulama
    image: ...
```

### PHP Composer vs Docker Compose

| | PHP Composer | Docker Compose |
|---|--------------|----------------|
| **Ne yapar?** | PHP **paketlerini** yönetir | Docker **container'ları** yönetir |
| **Dosya** | `composer.json` | `docker-compose.yml` |
| **Komut** | `composer install` | `docker compose up` |

### Kubernetes (K8s) Nedir?

**Docker Compose** = Tek bilgisayarda birden fazla container  
**Kubernetes** = **Birden fazla bilgisayarda** binlerce container

```
                    ┌─────────────────────────────────────┐
                    │         KUBERNETES CLUSTER          │
                    ├─────────────────────────────────────┤
                    │  ┌─────────┐  ┌─────────┐           │
     Kullanıcı      │  │ Node 1  │  │ Node 2  │           │
         │          │  │ ┌─────┐ │  │ ┌─────┐ │           │
         ▼          │  │ │App 1│ │  │ │App 2│ │           │
   Load Balancer ───┼──│ │App 3│ │  │ │App 4│ │           │
                    │  │ └─────┘ │  │ └─────┘ │           │
                    │  └─────────┘  └─────────┘           │
                    └─────────────────────────────────────┘
                    
✅ Bir sunucu çökerse, diğeri devralır
✅ Yük artarsa, otomatik yeni container açar
✅ Sıfır kesinti ile güncelleme
```

### Docker Restart Politikaları

| Politika | Davranış |
|----------|----------|
| `no` | Asla otomatik başlatma |
| `always` | Her zaman başlat (sistem açılışında dahil) |
| `unless-stopped` | Manuel durdurmadıysan, sistem açılışında başlat |
| `on-failure` | Sadece hata ile kapanırsa yeniden başlat |

### Sık Kullanılan Docker Komutları

```bash
# Container'ları başlat
docker compose up -d

# Container'ları durdur
docker compose down

# Container'ları durdur + volume'ları sil
docker compose down -v

# Çalışan container'ları listele
docker ps

# Container loglarını gör
docker logs <container_name>

# Container'a bağlan
docker exec -it <container_name> bash
```

### PostGIS Nedir?

PostgreSQL için bir **coğrafi uzantıdır**. Lojistik uygulamalarında:

| PostGIS Özelliği | Kullanım Alanı |
|------------------|----------------|
| `ST_Distance` | İki nokta arası mesafe hesaplama |
| `ST_DWithin` | Belirli yarıçaptaki noktaları bulma |
| `GEOGRAPHY` tipi | Enlem/Boylam verilerini saklama |
| Spatial Index | Koordinatlar arasında hızlı arama |

---

## Ders 2: Drizzle ORM Entegrasyonu

### Drizzle Nedir?

**Drizzle ORM** = TypeScript-first, hafif, SQL-benzeri ORM

| Paket | Açıklama |
|-------|----------|
| `drizzle-orm` | Ana ORM (sorgular, şema tanımı, tipler) |
| `drizzle-kit` | CLI aracı (migration, push, pull, studio) |

### Kurulum

```bash
# Runtime bağımlılıkları
npm install drizzle-orm@beta pg

# Development bağımlılıkları
npm install -D drizzle-kit@beta @types/pg
```

### Klasör Yapısı

```
src/
└── database/
    ├── schema/
    │   ├── index.ts      ← Barrel export
    │   ├── vehicles.ts   ← Araçlar tablosu
    │   └── deliveries.ts ← Teslimatlar tablosu
    └── index.ts          ← DB bağlantısı
```

### Tablo Tanımlama

```typescript
import { pgTable, serial, text, geometry, index } from "drizzle-orm/pg-core";

export const vehicles = pgTable("vehicles", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    start_location: geometry("start_location", {
        type: "point",
        mode: "xy",
        srid: 4326,
    }).notNull(),
}, (table) => [
    index("vehicles_location_idx").using("gist", table.start_location),
]);

// TypeScript tipleri
export type Vehicle = typeof vehicles.$inferSelect;
export type NewVehicle = typeof vehicles.$inferInsert;
```

### Drizzle Kolon Tipleri

| Fonksiyon | SQL Karşılığı |
|-----------|---------------|
| `serial('id')` | `id SERIAL` |
| `text('name')` | `name TEXT` |
| `doublePrecision('x')` | `x DOUBLE PRECISION` |
| `boolean('active')` | `active BOOLEAN` |
| `timestamp('date')` | `date TIMESTAMP` |
| `geometry('loc', {...})` | `loc GEOMETRY(POINT, 4326)` |

### Kolon Modifierleri

| Modifier | Açıklama |
|----------|----------|
| `.primaryKey()` | PRIMARY KEY |
| `.notNull()` | NOT NULL |
| `.default(value)` | DEFAULT value |
| `.defaultNow()` | DEFAULT now() |

### drizzle.config.ts

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./src/database/schema/index.ts",
    out: "./drizzle",
    dialect: "postgresql",
    extensionsFilters: ["postgis"],   // PostGIS tablolarını yok say
    schemaFilter: ["public"],          // Sadece public schema
    dbCredentials: {
        host: "localhost",
        port: 5432,
        user: "logistic_user",
        password: "logistic_secret_2026",
        database: "logistic_db",
        ssl: false,
    },
    verbose: true,
    strict: true,
});
```

### Drizzle-kit Komutları

| Komut | Açıklama |
|-------|----------|
| `npm run db:generate` | Migration dosyası oluştur |
| `npm run db:migrate` | Migration'ları uygula |
| `npm run db:push` | Şemayı direkt DB'ye yaz |
| `npm run db:pull` | DB'den şema çek |
| `npm run db:studio` | Web arayüzü aç |

### PostGIS Geometry Tipi

```typescript
// SRID 4326 = WGS84 (GPS koordinat sistemi)
location: geometry("location", {
    type: "point",    // Nokta tipi
    mode: "xy",       // { x: lng, y: lat } formatı
    srid: 4326,       // Koordinat sistemi
}).notNull()
```

### Spatial Index

```typescript
// GiST index - coğrafi sorgular için
index("location_idx").using("gist", table.location)
```

---

## Ders 3: Redis Entegrasyonu

*Bu ders henüz tamamlanmadı...*

---

## Ders 4: NestJS Entegrasyonu

*Bu ders henüz tamamlanmadı...*
