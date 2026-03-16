import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

type Json = Record<string, unknown>;

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

function asText(value: unknown): string | null {
  if (value == null) return null;
  const s = String(value).trim();
  return s === "" ? null : s;
}

function asInt(value: unknown, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

function asBool(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const s = value.trim().toLowerCase();
    if (s === "true") return true;
    if (s === "false") return false;
  }
  return fallback;
}

function asObject(value: unknown): Json {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Json)
    : {};
}

async function callRpc(
  supabase: ReturnType<typeof createClient>,
  fn: string,
  params: Record<string, unknown>,
) {
  const { data, error } = await supabase.rpc(fn, params);
  if (error) throw new Error(`${fn} failed: ${error.message}`);
  return data;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ ok: false, error: "POST only" }, 405);
  }

  try {
    const body = await req.json().catch(() => ({} as Json));
    const action = String(body.action ?? "bootstrap").trim();

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return jsonResponse({ ok: false, error: "Missing Supabase env" }, 500);
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const telegramChatId = asText(body.telegram_chat_id);
    const telegramUserId = asText(body.telegram_user_id);

    if (!telegramChatId || !telegramUserId) {
      return jsonResponse(
        { ok: false, error: "telegram_chat_id and telegram_user_id are required" },
        400,
      );
    }

    if (action === "bootstrap") {
      const data = await callRpc(supabase, "kz_miniapp_bootstrap_v1", {
        p_telegram_chat_id: telegramChatId,
        p_telegram_user_id: telegramUserId,
        p_active_mode_code: asText(body.active_mode_code),
        p_limit: asInt(body.limit, 10),
        p_offset: asInt(body.offset, 0),
        p_current_queue: asText(body.current_queue),
        p_state_patch: asObject(body.state_patch),
      });
      return jsonResponse({ ok: true, action, data });
    }

    if (action === "overview") {
      const data = await callRpc(supabase, "kz_miniapp_overview_screen_v1", {
        p_telegram_chat_id: telegramChatId,
        p_telegram_user_id: telegramUserId,
        p_active_mode_code: asText(body.active_mode_code),
        p_limit: asInt(body.limit, 10),
        p_offset: asInt(body.offset, 0),
        p_state_patch: asObject(body.state_patch),
      });
      return jsonResponse({ ok: true, action, data });
    }

    if (action === "queue") {
      const data = await callRpc(supabase, "kz_miniapp_queue_screen_v1", {
        p_telegram_chat_id: telegramChatId,
        p_telegram_user_id: telegramUserId,
        p_bucket: asText(body.bucket),
        p_region: asText(body.region),
        p_market_role: asText(body.market_role),
        p_heat_label_ru: asText(body.heat_label_ru),
        p_freshness_label_ru: asText(body.freshness_label_ru),
        p_has_contact: body.has_contact ?? null,
        p_contact_path_status_v2: asText(body.contact_path_status_v2),
        p_limit: asInt(body.limit, 20),
        p_offset: asInt(body.offset, 0),
        p_active_mode_code: asText(body.active_mode_code),
        p_state_patch: asObject(body.state_patch),
      });
      return jsonResponse({ ok: true, action, data });
    }

    if (action === "analytics") {
      const data = await callRpc(supabase, "kz_miniapp_analytics_screen_v1", {
        p_telegram_chat_id: telegramChatId,
        p_telegram_user_id: telegramUserId,
        p_active_mode_code: asText(body.active_mode_code),
        p_state_patch: asObject(body.state_patch),
      });
      return jsonResponse({ ok: true, action, data });
    }

    if (action === "open_candidate") {
      const candidateId = asText(body.candidate_id);
      if (!candidateId) {
        return jsonResponse({ ok: false, error: "candidate_id is required" }, 400);
      }
      const data = await callRpc(supabase, "kz_miniapp_open_candidate_v1", {
        p_telegram_chat_id: telegramChatId,
        p_telegram_user_id: telegramUserId,
        p_candidate_id: candidateId,
        p_current_queue: asText(body.current_queue),
        p_active_mode_code: asText(body.active_mode_code),
        p_active_mode_offset: asInt(body.active_mode_offset, 0),
        p_state_patch: asObject(body.state_patch),
      });
      return jsonResponse({ ok: true, action, data });
    }

    if (action === "run_result") {
      const data = await callRpc(supabase, "kz_miniapp_run_result_screen_v1", {
        p_telegram_chat_id: telegramChatId,
        p_telegram_user_id: telegramUserId,
        p_limit: asInt(body.limit, 10),
      });
      return jsonResponse({ ok: true, action, data });
    }

    if (action === "candidate_action") {
      const candidateId = asText(body.candidate_id);
      const candidateAction = asText(
        body.candidate_action ?? body.action_code ?? body.subaction,
      );
      if (!candidateId || !candidateAction) {
        return jsonResponse(
          { ok: false, error: "candidate_id and candidate_action are required" },
          400,
        );
      }
      const data = await callRpc(supabase, "kz_candidate_action_by_telegram", {
        p_candidate_id: candidateId,
        p_action: candidateAction,
        p_actor_telegram_user_id: telegramUserId,
        p_note: asText(body.note),
      });
      return jsonResponse({ ok: true, action, data });
    }

    if (action === "manager_action") {
      const assignmentId = asText(body.assignment_id);
      const managerAction = asText(
        body.manager_action ?? body.action_code ?? body.subaction,
      );
      if (!assignmentId || !managerAction) {
        return jsonResponse(
          { ok: false, error: "assignment_id and manager_action are required" },
          400,
        );
      }
      const data = await callRpc(supabase, "kz_manager_assignment_action", {
        p_assignment_id: assignmentId,
        p_action: managerAction,
        p_actor_telegram_user_id: telegramUserId,
        p_note: asText(body.note),
      });
      return jsonResponse({ ok: true, action, data });
    }

    if (action === "run_search") {
      const runnerRes = await fetch(
        `${supabaseUrl}/functions/v1/kz-warehouse-search-runner`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${serviceRoleKey}`,
            apikey: serviceRoleKey,
          },
          body: JSON.stringify({
            preset_code: asText(body.active_mode_code) ?? "kz_mode_global_10",
            region: asText(body.region),
            batch_size: asInt(body.batch_size, 5),
            source_codes: Array.isArray(body.source_codes)
              ? body.source_codes
              : null,
            telegram_chat_id: telegramChatId,
            telegram_user_id: telegramUserId,
            live_search: asBool(body.live_search, true),
            workspace_limit: asInt(body.limit, 10),
            entry_surface: "miniapp",
          }),
        },
      );
      const runnerJson = await runnerRes.json().catch(() => ({}));
      if (!runnerRes.ok) {
        return jsonResponse(
          { ok: false, action, error: "search runner failed", details: runnerJson },
          500,
        );
      }
      return jsonResponse({ ok: true, action, data: runnerJson });
    }

    return jsonResponse({ ok: false, error: `Unknown action: ${action}` }, 400);
  } catch (error) {
    return jsonResponse(
      {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      },
      500,
    );
  }
});
