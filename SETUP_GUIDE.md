# Pactum Spider - MVP Networking Platform
## Complete Setup & Deployment Guide

Plataforma de networking, matching y colaboración para emprendedores en Ecuador.

---

## 📋 Estado del Proyecto

**Completado:** Sprint 1, Sprint 2, Sprint 3 (parcial), Sprint 4 (parcial)
**Componentes Implementados:**
- ✅ Autenticación con Supabase
- ✅ CRUD completo de Usuarios, Proyectos, Vacantes
- ✅ Motor de Matching con algoritmo de puntuación
- ✅ Directorio público de proyectos
- ✅ Sistema de solicitudes de unión
- ✅ Página de Matches con interacción en tiempo real

**Pendiente de Configuración Manualmente:**
- Stripe (Pagos y Suscripciones)
- Resend/SendGrid (Notificaciones por email)
- OpenAI (Embeddings para matching avanzado)

---

## 🚀 Inicio Rápido

### Requisitos Previos
```bash
Node.js 18+ 
npm 9+
Cuenta en Supabase
```

### Instalación Local
```bash
cd pactum_spider
npm install
npm run dev
```

La aplicación estará en `http://localhost:3000`

---

## 🔧 Configuración de Integraciones

### 1️⃣ Stripe - Pagos y Suscripciones

**QUÉ HACER TÚ:**

1. Ve a https://dashboard.stripe.com
2. Crea una cuenta (o inicia sesión)
3. En Dashboard → Developers → API Keys:
   - Copia la **Secret Key** (comienza con `sk_test_` o `sk_live_`)
   - Copia la **Publishable Key** (comienza con `pk_test_` o `pk_live_`)

4. Configura Webhooks en Developers → Webhooks:
   - Click "Add endpoint"
   - URL: `https://tudominio.com/api/stripe/webhook` (después del deploy)
   - Eventos: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copia el **Webhook Signing Secret** (comienza con `whsec_`)

5. Crea los Productos/Precios en Products:
   - Plan Pro: $19/mes
   - Plan Scale: $49/mes

**LUEGO, el dev (yo) hará:**

```bash
# Agregamos las variables al .env.local
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Y completar:
- `/src/app/api/stripe/checkout-session/route.ts` - Crear sesiones de checkout
- `/src/app/api/stripe/webhook/route.ts` - Procesar webhooks
- Lógica de verificación de plan en endpoints

---

### 2️⃣ Resend - Notificaciones por Email

**QUÉ HACER TÚ:**

1. Ve a https://resend.com
2. Crea una cuenta gratuita
3. Verifica tu dominio (o usa el dominio sandbox)
4. En Settings → API Keys:
   - Copia la **API Key**

**LUEGO, el dev (yo) hará:**

```bash
RESEND_API_KEY=re_...
```

E implementaré:
- `/src/lib/email.ts` - Templates de email
- Disparadores automáticos de notificación en:
  - Nuevo match aceptado
  - Solicitud de unión aprobada/rechazada
  - Mensajes nuevos

---

### 3️⃣ OpenAI - Matching Avanzado (Opcional)

**QUÉ HACER TÚ (si quieres mejorar el matching):**

1. Ve a https://platform.openai.com
2. Crea una cuenta / inicia sesión
3. API Keys → Create new secret key
4. Copia la key

**LUEGO, el dev (yo) hará:**

```bash
OPENAI_API_KEY=sk-proj-...
```

E implementaré:
- Embeddings de perfiles completos
- Combinación de scoring por reglas (70%) + similitud de embeddings (30%)
- Mejora significativa en calidad de matches

---

## 📱 Variables de Entorno (.env.local)

```env
# Supabase (ya configurado)
NEXT_PUBLIC_SUPABASE_URL=https://qlsvtxqengdsalxhbiiw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Stripe (a configurar)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend (a configurar)
RESEND_API_KEY=re_...

# OpenAI (opcional)
OPENAI_API_KEY=sk-proj-...

# Otros
NODE_ENV=development
```

---

## 🗄️ Base de Datos - Migraciones

**Archivo de migración disponible:**
`/supabase/migrations/20260402_complete_schema.sql`

**QUÉ HACER TÚ:**

1. En Supabase Dashboard → SQL Editor
2. Click "New Query"
3. Copia y pega el contenido de `20260402_complete_schema.sql`
4. Ejecuta la query

Esto creará todas las tablas, índices, triggers y políticas de Row Level Security.

---

## 🎯 Sprint 2 - Motor de Matching

**Completado:**

- ✅ Algoritmo de scoring con 4 criterios:
  - Skills complementarias (máx 40 pts) - Penaliza identidad
  - Intereses compartidos (máx 25 pts)
  - Ubicación (máx 20 pts)
  - Actividad reciente (máx 15 pts)
  - **Umbral mínimo: 35 puntos**

- ✅ API Endpoints:
  - `GET /api/matches` - Listar matches del usuario
  - `GET /api/matches?status=pendiente|aceptado|rechazado` - Filtrar por estado
  - `PATCH /api/matches/[id]` - Aceptar/Rechazar match
  - `POST /api/matches/calculate` - Calcular matches (background job)

- ✅ Página de Matches (`/matches`):
  - Visualización con score visible
  - Filtros por estado
  - Botones Conectar/Rechazar
  - Crea match_room automáticamente al aceptar

**Uso:**

1. Usuario completa onboarding con skills e intereses
2. Click "🔄 Recalcular Matches" en `/matches`
3. Algoritmo calcula compatibilidad con todos los usuarios
4. Se muestran matches con score >= 35
5. Usuario puede aceptar, rechazar o ignorar

---

## 🔐 Sprint 3 - Stripe Integration (A Completar)

**Qué falta (para después de que configures Stripe):**

```typescript
// /src/app/api/stripe/checkout-session/route.ts
// Crear Checkout Session para usuario

// /src/app/api/stripe/webhook/route.ts
// Procesar pagos exitosos → actualizar plan en BD

// /src/middleware.ts
// Verificar plan Free/Pro/Scale en rutas protegidas
// Bloquear aciones según plan (ej: máx 3 matches/mes en Free)

// /src/app/api/matches/[id]/route.ts
// Agregar restricción: 3 solicitudes/mes en plan Free
```

---

## 💬 Sprint 3 - Chat Real-time (A Completar)

**Qué falta:**

- `/src/app/chat/[roomId]/page.tsx` - Interfaz de chat
- `/src/app/api/messages/route.ts` - Enviar/recibir mensajes
- Realtime subscription con Supabase

**Flujo:**
1. Usuario acepta match → Se crea `match_room`
2. Ambos usuarios ven botón "Chat"
3. Click → Acceden a `/chat/[room_id]`
4. Mensajes en tiempo real con Supabase Realtime

---

## 📊 Sprint 4 - Analytics (A Completar)

**Qué falta:**

- `/src/app/analytics/page.tsx` - Dashboard para fundadores
- Métricas:
  - Total de visitantes
  - Solicitudes de unión recibidas
  - Tasa de aceptación de matches
  - Proyectos activos

---

## 🧪 Testing

**Endpoints de matching:**

```bash
# Calcular matches para usuario actual
curl -X POST http://localhost:3000/api/matches/calculate \
  -H "Authorization: Bearer $JWT_TOKEN"

# Obtener matches pendientes
curl http://localhost:3000/api/matches?status=pendiente \
  -H "Authorization: Bearer $JWT_TOKEN"

# Aceptar un match
curl -X PATCH http://localhost:3000/api/matches/[match_id] \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"estado": "aceptado"}'
```

---

## 🚢 Deployment

### Frontend (Vercel)

```bash
# Conectar GitHub repo a Vercel
# Vercel detecta Next.js automáticamente
# Variables de entorno: agregar en Vercel Dashboard → Settings → Environment Variables
```

### Backend (API Routes están en Next.js)

No necesita deploy separado - todo va a Vercel junto al frontend.

### Base de Datos (Supabase)

Ya está en producción. Solo hay que:
1. Ejecutar migraciones en SQL editor
2. Habilitar RLS si no está habilitado

---

## 📚 Documentación de Código

### Matching Algorithm (`/src/lib/matching.ts`)

```typescript
// Calcular score entre dos usuarios
const score = calculateMatchScore(userA, userB); // 0-100

// Obtener breakdown detallado
const breakdown = getScoreBreakdown(userA, userB);
// {
//   complementarySkills: 40,
//   sharedInterests: 15,
//   location: 20,
//   recentActivity: 8,
//   total: 83
// }

// Verificar si cumple umbral
const meetsThreshold = meetsMatchThreshold(83); // true
```

### API Matching

```typescript
// Tipos en /src/lib/types.ts
interface Match {
  id: string;
  user_a_id: string;
  user_b_id: string;
  score: number;
  estado: "pendiente" | "aceptado" | "rechazado";
  created_at: string;
  other_user?: UserProfile;
  is_user_a?: boolean;
}
```

---

## ✅ Checklist - Próximos Pasos

- [ ] Configurar Stripe (obtener keys y webhook secret)
- [ ] Configurar Resend API key
- [ ] Ejecutar migraciones en Supabase
- [ ] Completar módulo de Chat Real-time
- [ ] Completar integración Stripe
- [ ] Completar dashboard de Analytics
- [ ] Pruebas con 10 usuarios reales
- [ ] Deploy en Vercel

---

## 🐛 Troubleshooting

### "Match score always 0"
→ Verificar que usuarios tienen skills e intereses completados

### "Matches no se crean"
→ Ejecutar POST `/api/matches/calculate` manualmente
→ Verificar score >= 35

### "Error al actualizar match"
→ Verificar que usuario autenticado es parte del match
→ Revisar RLS policies en Supabase

---

## 📞 Soporte

Todas las funcionalidades están documentadas en el código.
Buscar por "TODO" o "FIXME" para encontrar áreas a completar.

---

**Last Updated:** 2026-04-02
**Version:** MVP 1.0
**Status:** Ready for Staging
