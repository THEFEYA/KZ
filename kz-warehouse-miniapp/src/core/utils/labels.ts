// Human-readable Russian labels for all internal codes

const MARKET_ROLE_MAP: Record<string, string> = {
  buyer: 'Покупатель',
  seller: 'Продавец',
  operator: 'Оператор',
  contractor: 'Подрядчик',
  developer: 'Застройщик',
  logistics: 'Логистика',
  manufacturer: 'Производитель',
  warehouse_operator: 'Складской оператор',
  procurement: 'Закупки',
  lessee: 'Арендатор',
  lessor: 'Арендодатель',
}

const SIGNAL_TYPE_MAP: Record<string, string> = {
  procurement_equipment: 'Закупка оборудования',
  lease_request: 'Запрос аренды',
  tender_publication: 'Тендерная публикация',
  vacancy_signal: 'Сигнал по вакансии',
  expansion_signal: 'Сигнал расширения',
  warehouse_search: 'Поиск склада',
  equipment_search: 'Поиск техники',
  facility_construction: 'Строительство объекта',
  logistics_contract: 'Логистический контракт',
  investment_signal: 'Инвестиционный сигнал',
  regulatory_signal: 'Регуляторный сигнал',
  market_entry: 'Выход на рынок',
}

const CONTACT_STATUS_MAP: Record<string, string> = {
  direct_contact_found: 'Прямой контакт',
  indirect_contact_path_found: 'Путь связи',
  no_contact_found: 'Контакт не найден',
  direct: 'Прямой контакт',
  path: 'Путь связи',
  none: 'Контакт не найден',
}

const HEAT_MAP: Record<string, string> = {
  hot: 'Горячий',
  warm: 'Тёплый',
  cold: 'Холодный',
  'Горячий': 'Горячий',
  'Тёплый': 'Тёплый',
  'Холодный': 'Холодный',
}

const FRESHNESS_MAP: Record<string, string> = {
  fresh: 'Свежий',
  actual: 'Актуальный',
  stale: 'Устаревший',
  'Свежий': 'Свежий',
  'Актуальный': 'Актуальный',
  'Устаревший': 'Устаревший',
}

const ENTITY_TYPE_MAP: Record<string, string> = {
  company: 'Компания',
  object: 'Объект',
}

export function labelMarketRole(raw: string | null | undefined): string {
  if (!raw) return 'Роль не указана'
  return MARKET_ROLE_MAP[raw] ?? raw
}

export function labelSignalType(raw: string | null | undefined): string {
  if (!raw) return 'Сигнал не определён'
  return SIGNAL_TYPE_MAP[raw] ?? raw
}

export function labelContactStatus(raw: string | null | undefined): string {
  if (!raw) return 'Не определён'
  return CONTACT_STATUS_MAP[raw] ?? raw
}

export function labelHeat(raw: string | null | undefined): string {
  if (!raw) return 'Не определён'
  return HEAT_MAP[raw] ?? raw
}

export function labelFreshness(raw: string | null | undefined): string {
  if (!raw) return 'Не определена'
  return FRESHNESS_MAP[raw] ?? raw
}

export function labelEntityType(raw: string | null | undefined): string {
  if (!raw) return 'Сущность'
  return ENTITY_TYPE_MAP[raw] ?? raw
}

export function labelQueueBucket(raw: string | null | undefined): string {
  if (raw === 'action_queue') return 'Рабочая очередь'
  if (raw === 'review_queue') return 'Очередь проверки'
  if (raw === 'confirmed_leads') return 'Подтверждённые лиды'
  return raw ?? 'Очередь'
}
