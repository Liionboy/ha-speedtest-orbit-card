const CARD_TYPE = "ha-speedtest-orbit-card";
const VERSION = "1.0.2";
const PALETTES = new Set(["aurora", "ocean", "sunset", "lavender"]);
const METRICS = [
  { key: "download", label: "Download", icon: "mdi:download" },
  { key: "upload", label: "Upload", icon: "mdi:upload" },
  { key: "ping", label: "Ping", icon: "mdi:timer-outline" },
];
const DEFAULTS = {
  title: "Internet Speed",
  palette: "ocean",
  auto_discover: true,
  download_entity: "",
  upload_entity: "",
  ping_entity: "",
};

const STYLE = `
  :host{display:block;min-width:0;max-width:100%;color:var(--primary-text-color)}
  ha-card{box-sizing:border-box;width:100%;min-width:0;max-width:100%;container-type:inline-size;container-name:speedtest-card;overflow:hidden;border:1px solid color-mix(in srgb,var(--divider-color) 58%,transparent);border-radius:24px;background:var(--ha-card-background,var(--card-background-color,#fff));box-shadow:var(--ha-card-box-shadow,0 12px 34px rgba(20,35,55,.1))}
  ha-card[data-palette="aurora"]{--accent:#078f72;--accent2:#27b7b0;--accent3:#54a9db}ha-card[data-palette="ocean"]{--accent:#1477c9;--accent2:#22a7c7;--accent3:#6b68d8}ha-card[data-palette="sunset"]{--accent:#df5d42;--accent2:#ee973f;--accent3:#cf5d9e}ha-card[data-palette="lavender"]{--accent:#8059c7;--accent2:#b56cc8;--accent3:#4c9bc7}
  .shell{position:relative;padding:clamp(16px,3cqi,22px);background:radial-gradient(ellipse at 0 0,color-mix(in srgb,var(--accent) 13%,transparent),transparent 54%),radial-gradient(ellipse at 100% 100%,color-mix(in srgb,var(--accent2) 9%,transparent),transparent 48%)}.shell:before{position:absolute;top:0;right:22px;left:22px;height:3px;border-radius:0 0 4px 4px;background:linear-gradient(90deg,var(--accent),var(--accent2),var(--accent3));content:""}
  .header{display:flex;align-items:center;justify-content:space-between;gap:12px;min-width:0}.identity{display:flex;align-items:center;gap:12px;min-width:0}.icon-wrap{display:grid;place-items:center;flex:none;width:48px;height:48px;border:1px solid color-mix(in srgb,var(--accent) 24%,transparent);border-radius:17px;background:linear-gradient(145deg,var(--accent),var(--accent2));box-shadow:0 7px 18px color-mix(in srgb,var(--accent) 22%,transparent);color:#fff}.icon-wrap ha-icon{--mdc-icon-size:25px}.identity-copy{min-width:0}.eyebrow{color:var(--accent);font-size:9px;font-weight:800;letter-spacing:.14em;text-transform:uppercase}.title{overflow:hidden;margin:3px 0 0;font-size:clamp(16px,2.5cqi,20px);font-weight:780;letter-spacing:-.03em;text-overflow:ellipsis;white-space:nowrap}
  .pill{display:flex;align-items:center;gap:7px;padding:7px 10px;border:1px solid color-mix(in srgb,currentColor 12%,transparent);border-radius:999px;background:color-mix(in srgb,currentColor 8%,var(--card-background-color,#fff));color:var(--secondary-text-color);font-size:11px;font-weight:750;white-space:nowrap}.dot{width:7px;height:7px;border-radius:50%;background:currentColor;box-shadow:0 0 0 3px color-mix(in srgb,currentColor 16%,transparent)}.pill.online{color:var(--success-color,#168b68)}
  .hero{position:relative;display:grid;grid-template-columns:minmax(110px,.8fr) minmax(0,1.2fr);align-items:center;gap:18px;min-height:174px;margin-top:17px;padding:18px;border:1px solid color-mix(in srgb,var(--accent) 17%,var(--divider-color));border-radius:19px;background:radial-gradient(circle at 25% 50%,color-mix(in srgb,var(--accent) 13%,transparent),transparent 32%),linear-gradient(135deg,color-mix(in srgb,var(--accent) 5%,var(--card-background-color,#fff)),var(--secondary-background-color,#f1f3f5));overflow:hidden}.radar{position:relative;display:grid;place-items:center;justify-self:center;width:132px;aspect-ratio:1;border:1px solid color-mix(in srgb,var(--accent) 30%,var(--divider-color));border-radius:50%;background:repeating-radial-gradient(circle,transparent 0 19px,color-mix(in srgb,var(--accent) 16%,transparent) 20px 21px);box-shadow:inset 0 0 28px color-mix(in srgb,var(--accent) 9%,transparent)}.radar:before{position:absolute;inset:10%;border-radius:50%;background:conic-gradient(from 230deg,transparent 0 62%,color-mix(in srgb,var(--accent2) 28%,transparent) 83%,transparent);content:"";animation:sweep 6s linear infinite}.radar:after{position:absolute;inset:50% 50% 0 0;border-top:1px solid color-mix(in srgb,var(--accent) 45%,transparent);content:"";transform-origin:100% 0;animation:sweep 6s linear infinite}.radar-core{z-index:1;display:grid;place-items:center;width:66px;aspect-ratio:1;border:1px solid color-mix(in srgb,var(--accent) 34%,transparent);border-radius:50%;background:var(--card-background-color,#fff);box-shadow:0 0 0 7px color-mix(in srgb,var(--accent) 8%,transparent),0 5px 18px color-mix(in srgb,var(--accent) 15%,transparent);color:var(--accent)}.radar-core ha-icon{--mdc-icon-size:28px}.radar-caption{position:absolute;bottom:-22px;color:var(--secondary-text-color);font-size:9px;font-weight:750;letter-spacing:.12em;text-transform:uppercase;white-space:nowrap}
  .hero-copy{min-width:0}.hero-label{color:var(--secondary-text-color);font-size:10px;font-weight:750;letter-spacing:.1em;text-transform:uppercase}.hero-value{margin-top:4px;color:var(--primary-text-color);font-size:clamp(27px,7cqi,42px);font-weight:820;letter-spacing:-.055em;line-height:1.1;font-variant-numeric:tabular-nums;white-space:nowrap}.hero-unit{color:var(--secondary-text-color);font-size:13px;font-weight:650;letter-spacing:0}.hero-sub{margin-top:7px;color:var(--secondary-text-color);font-size:10px;line-height:1.4}
  .metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:10px}.metric{position:relative;min-width:0;overflow:hidden;padding:11px;border:1px solid color-mix(in srgb,var(--divider-color) 68%,transparent);border-radius:15px;background:color-mix(in srgb,var(--card-background-color,#fff) 91%,var(--accent))}.metric:after{position:absolute;right:-15px;bottom:-24px;width:60px;height:60px;border:1px solid color-mix(in srgb,var(--accent) 22%,transparent);border-radius:50%;content:""}.metric-head{display:flex;align-items:center;gap:6px;color:var(--secondary-text-color);font-size:9px;font-weight:750;letter-spacing:.07em;text-transform:uppercase}.metric-head ha-icon{color:var(--accent);--mdc-icon-size:16px}.metric-value{overflow:hidden;margin-top:7px;color:var(--primary-text-color);font-size:clamp(14px,3.3cqi,19px);font-weight:800;font-variant-numeric:tabular-nums;text-overflow:ellipsis;white-space:nowrap}.metric-value.unavailable{color:var(--secondary-text-color);font-size:12px}.metric-unit{margin-left:3px;color:var(--secondary-text-color);font-size:9px;font-weight:600}.sparkline{display:block;width:100%;height:20px;margin-top:5px;overflow:visible}.sparkline polyline{fill:none;stroke:var(--accent);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.sparkline.upload polyline{stroke:var(--accent2)}.sparkline.ping polyline{stroke:var(--accent3)}
  .footer{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:10px;padding:0 2px}.footer-copy{overflow:hidden;color:var(--secondary-text-color);font-size:10px;text-overflow:ellipsis;white-space:nowrap}.footer-copy strong{color:var(--primary-text-color);font-weight:700}.hint{margin-top:12px;padding:10px 12px;border:1px dashed color-mix(in srgb,var(--secondary-text-color) 35%,transparent);border-radius:12px;color:var(--secondary-text-color);font-size:10px;line-height:1.45}.hint.error{border-color:color-mix(in srgb,var(--error-color,#c74343) 45%,transparent);color:var(--error-color,#c74343)}
  @keyframes sweep{to{transform:rotate(360deg)}}@container speedtest-card (max-width:420px){.shell{padding:15px}.identity{gap:9px}.icon-wrap{width:40px;height:40px;border-radius:14px}.icon-wrap ha-icon{--mdc-icon-size:22px}.pill{gap:5px;padding:6px 8px;font-size:10px}.hero{grid-template-columns:94px minmax(0,1fr);gap:12px;min-height:146px;padding:13px}.radar{width:92px}.radar-core{width:49px}.radar-core ha-icon{--mdc-icon-size:22px}.radar-caption{bottom:-17px;font-size:8px}.metrics{gap:6px}.metric{padding:8px}.metric-head{gap:4px;font-size:8px}.metric-head ha-icon{--mdc-icon-size:14px}.sparkline{height:15px}}@container speedtest-card (max-width:320px){.shell{padding:12px}.header{gap:7px}.identity{gap:7px}.icon-wrap{width:36px;height:36px}.title{font-size:15px}.pill{padding:5px 7px;font-size:9px}.hero{grid-template-columns:1fr;justify-items:center;gap:21px}.hero-copy{text-align:center}.radar{width:104px}.metrics{grid-template-columns:1fr}.metric{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:2px 8px}.metric-head{grid-column:1}.metric-value{grid-column:1;margin-top:1px}.sparkline{grid-column:2;grid-row:1/3;width:70px;height:28px;margin:0}}
  @media(prefers-reduced-motion:reduce){.radar:before,.radar:after{animation:none!important}}
`;

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function isUnavailable(state) {
  return !state || ["unknown", "unavailable", "none", ""].includes(String(state.state ?? "").toLowerCase());
}

function numericValue(state) {
  if (isUnavailable(state)) return null;
  const value = Number(state.state);
  return Number.isFinite(value) ? value : null;
}

function formatMetric(state, decimals, fallbackUnit) {
  const number = numericValue(state);
  if (number === null) return { value: "—", unit: "", available: false };
  return {
    value: new Intl.NumberFormat(undefined, { maximumFractionDigits: decimals }).format(number),
    unit: state.attributes?.unit_of_measurement || fallbackUnit,
    available: true,
  };
}

function normalized(value) { return String(value ?? "").toLowerCase().replace(/[^a-z0-9]/g, ""); }

class SpeedtestOrbitCard extends HTMLElement {
  static getStubConfig() { return { ...DEFAULTS }; }

  static getConfigForm() {
    return { schema: [
      { name: "title", selector: { text: {} } },
      { name: "palette", selector: { select: { options: ["aurora", "ocean", "sunset", "lavender"], mode: "dropdown" } } },
      { name: "auto_discover", selector: { boolean: {} } },
      { name: "download_entity", selector: { entity: { domain: "sensor" } } },
      { name: "upload_entity", selector: { entity: { domain: "sensor" } } },
      { name: "ping_entity", selector: { entity: { domain: "sensor" } } },
    ] };
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = { ...DEFAULTS };
    this._history = { download: [], upload: [], ping: [] };
    this._signature = null;
  }

  setConfig(config) {
    if (!config || typeof config !== "object") throw new Error("Invalid Speedtest Orbit Card configuration.");
    this._config = {
      ...DEFAULTS,
      ...config,
      palette: PALETTES.has(config.palette) ? config.palette : DEFAULTS.palette,
      auto_discover: config.auto_discover !== false,
    };
    this._signature = null;
    this._render();
  }

  set hass(value) {
    this._hass = value;
    const data = this._resolve();
    this._record(data);
    const signature = JSON.stringify({ config: this._config, data });
    if (signature !== this._signature) {
      this._signature = signature;
      this._render(data);
    }
  }
  get hass() { return this._hass; }
  getCardSize() { return 4; }
  getGridOptions() { return { rows: 5, columns: 12, min_rows: 3 }; }

  _resolve() {
    const states = this._hass?.states || {};
    const entries = Object.values(this._hass?.entities || {}).map((entry) => ({
      id: entry.entity_id,
      platform: entry.platform,
      name: entry.original_name || entry.name || states[entry.entity_id]?.attributes?.friendly_name || entry.entity_id,
    }));
    const registeredIds = new Set(entries.map((entry) => entry.id));
    for (const id of Object.keys(states)) {
      if (id.startsWith("sensor.") && !registeredIds.has(id)) entries.push({ id, platform: "", name: states[id]?.attributes?.friendly_name || id });
    }
    const ids = {};
    for (const key of ["download", "upload", "ping"]) {
      const explicit = this._config[`${key}_entity`];
      if (explicit) { ids[key] = explicit; continue; }
      if (!this._config.auto_discover) { ids[key] = ""; continue; }
      const aliases = key === "ping" ? ["ping", "latency"] : [key];
      const matchesMetric = (entry) => aliases.some((alias) => normalized(entry.name).includes(alias) || normalized(entry.id).includes(alias));
      const isAvailable = (entry) => !isUnavailable(states[entry.id]);
      const native = entries.find((entry) => entry.platform === "speedtestdotnet" && matchesMetric(entry) && isAvailable(entry));
      const namedSpeedtest = entries.find((entry) => normalized(`${entry.name} ${entry.id}`).includes("speedtest") && matchesMetric(entry) && isAvailable(entry));
      const conventional = `sensor.speedtest_${key}`;
      const conventionalAvailable = states[conventional] && !isUnavailable(states[conventional]) ? conventional : "";
      ids[key] = native?.id || namedSpeedtest?.id || conventionalAvailable
        || entries.find((entry) => entry.platform === "speedtestdotnet" && matchesMetric(entry))?.id
        || entries.find((entry) => normalized(`${entry.name} ${entry.id}`).includes("speedtest") && matchesMetric(entry))?.id
        || (states[conventional] ? conventional : "");
    }
    const data = { ids, title: this._config.title || "Internet Speed", palette: this._config.palette };
    const fallbacks = { download: "Mbit/s", upload: "Mbit/s", ping: "ms" };
    for (const { key } of METRICS) {
      data[key] = ids[key] ? states[ids[key]] : undefined;
      data[`${key}Metric`] = formatMetric(data[key], key === "ping" ? 0 : 1, fallbacks[key]);
    }
    data.lastChanged = [data.download, data.upload, data.ping]
      .filter(Boolean).map((state) => state.last_changed).filter(Boolean).sort().at(-1) || "";
    return data;
  }

  _record(data) {
    for (const { key } of METRICS) {
      const value = numericValue(data[key]);
      if (value === null) continue;
      const samples = this._history[key];
      if (samples.at(-1)?.value !== value) samples.push({ value });
      if (samples.length > 18) samples.splice(0, samples.length - 18);
    }
  }

  _sparkline(key) {
    const values = this._history[key].map((sample) => sample.value);
    if (values.length < 2) return `<svg class="sparkline ${key}" viewBox="0 0 100 24" aria-hidden="true"></svg>`;
    const min = Math.min(...values);
    const span = Math.max(...values) - min || 1;
    const points = values.map((value, index) => `${(index / (values.length - 1)) * 100},${21 - ((value - min) / span) * 17}`).join(" ");
    return `<svg class="sparkline ${key}" viewBox="0 0 100 24" aria-hidden="true"><polyline points="${points}"></polyline></svg>`;
  }

  _render(data = this._resolve()) {
    if (!this.shadowRoot || !this._hass) return;
    const ready = [data.downloadMetric, data.uploadMetric, data.pingMetric].filter((metric) => metric.available).length;
    const status = ready === 3 ? "Measurements ready" : ready ? `${ready}/3 measurements` : "Sensors not found";
    const hero = data.downloadMetric.available ? data.downloadMetric : data.uploadMetric;
    const heroLabel = hero === data.downloadMetric ? "Download speed" : "Upload speed";
    const heroHtml = hero.available
      ? `<div class="hero"><div class="radar"><div class="radar-core"><ha-icon icon="mdi:speedometer"></ha-icon></div><span class="radar-caption">Speedtest.net</span></div><div class="hero-copy"><div class="hero-label">${heroLabel}</div><div class="hero-value">${hero.value} <span class="hero-unit">${escapeHtml(hero.unit)}</span></div><div class="hero-sub">Latest measurement from Home Assistant</div></div></div>`
      : `<div class="hint ${ready ? "" : "error"}">${ready ? "Choose a download or upload entity to show the featured speed." : "No Speedtest sensors found. Select the download, upload, and ping sensors in the card editor, or enable auto-discovery for the Speedtest.net integration."}</div>`;
    const metrics = METRICS.map(({ key, label, icon }) => {
      const metric = data[`${key}Metric`];
      return `<div class="metric"><div class="metric-head"><ha-icon icon="${icon}"></ha-icon>${label}</div><div class="metric-value ${metric.available ? "" : "unavailable"}">${metric.value}${metric.available ? `<span class="metric-unit">${escapeHtml(metric.unit)}</span>` : ""}</div>${this._sparkline(key)}</div>`;
    }).join("");
    let updated = "";
    if (data.lastChanged) {
      const date = new Date(data.lastChanged);
      if (Number.isFinite(date.getTime())) updated = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(date);
    }
    this.shadowRoot.innerHTML = `<style>${STYLE}</style><ha-card data-palette="${escapeHtml(data.palette)}"><div class="shell"><header class="header"><div class="identity"><div class="icon-wrap"><ha-icon icon="mdi:speedometer"></ha-icon></div><div class="identity-copy"><div class="eyebrow">Network · Speedtest</div><h2 class="title">${escapeHtml(data.title)}</h2></div></div><div class="pill ${ready === 3 ? "online" : ""}"><span class="dot"></span>${escapeHtml(status)}</div></header>${heroHtml}<section class="metrics">${metrics}</section>${updated ? `<footer class="footer"><div class="footer-copy"><strong>Last measurement:</strong> ${escapeHtml(updated)}</div><div class="footer-copy">Values from Home Assistant</div></footer>` : ""}</div></ha-card>`;
  }
}

if (!customElements.get(CARD_TYPE)) customElements.define(CARD_TYPE, SpeedtestOrbitCard);
window.customCards = window.customCards || [];
window.customCards.push({ type: CARD_TYPE, name: "Speedtest Orbit Card", description: "A themed Home Assistant Speedtest.net sensor card.", preview: false, documentationURL: "https://github.com/Liionboy/ha-speedtest-orbit-card" });
console.info(`%c SPEEDTEST-ORBIT %c ${VERSION} `, "background:#1477c9;color:#fff;font-weight:700", "background:var(--card-background-color);color:var(--primary-text-color)");
