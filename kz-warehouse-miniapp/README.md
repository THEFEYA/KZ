# KZ Warehouse — Telegram Mini App

Signal-driven lead engine для Казахстана. Ищет, доказывает, оценивает и приоритизирует сигналы спроса на складскую и производственную технику.

## Быстрый старт

```bash
# 1. Установить зависимости
npm install

# 2. Настроить переменные окружения
cp env.example .env.local
# Заполнить VITE_SUPABASE_URL и VITE_SUPABASE_PUBLISHABLE_KEY

# 3. Запустить dev-сервер
npm run dev

# 4. Сборка для production
npm run build
```

## Подключение к Supabase

1. Откройте Supabase Dashboard → Settings → API
2. Скопируйте **Project URL** в `VITE_SUPABASE_URL`
3. Скопируйте **anon/public key** в `VITE_SUPABASE_PUBLISHABLE_KEY`
4. Убедитесь, что RPC-функции доступны для роли `anon`:
   - `public.kz_miniapp_queue_v2`
   - `public.kz_miniapp_record_detail_v1`
   - `public.kz_miniapp_analytics_v2`

## Деплой как Telegram Mini App

1. Собрать проект: `npm run build`
2. Разместить `dist/` на HTTPS-хостинге (Vercel, Netlify, Cloudflare Pages)
3. В BotFather: `/newapp` → указать HTTPS URL
4. Опционально: настроить `VITE_TELEGRAM_BOT_NAME`

## Стек

- **React 18** + **TypeScript** + **Vite**
- **@supabase/supabase-js** — работа с Supabase RPC
- **@tma.js/sdk** — Telegram Mini App SDK
- **TanStack Query** — серверный стейт и кеширование
- **Zustand** — локальный UI-стейт (фильтры, режим, тема)
- **Recharts** — графики
- **React Router** — навигация

## Архитектура

```
src/
  app/          — провайдеры, layout, роуты
  core/         — конфиг, supabase, telegram, стейт, типы, утилиты
  pages/        — страницы (Overview, Queues, Analytics, Detail, Settings)
  features/     — feature-модули (overview, queues, detail, analytics, filters, modes, settings)
  shared/       — переиспользуемые UI-компоненты, графики, стили
```

## Темы

- **Ночной режим** — тёмный синий, cyan-акценты
- **Кислотный импульс** — тёмный, acid green/yellow акценты
- **Фиолетовое стекло** — тёмный, violet/pink акценты

## Optional Backend Patch-list

Минимальные улучшения к существующему backend (опционально):

1. `kz_miniapp_analytics_v2` — добавить поле `top_insight` с предвычисленным главным выводом для Overview
2. `kz_miniapp_queue_v2` — убедиться, что `confirmed_leads` доступен как bucket-параметр
3. `kz_miniapp_record_detail_v1` — добавить массив `source_links` с `{label, url}` для явных ссылок
4. Добавить `freshness_days` в summary для корректного отображения метрики свежести
