import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../ha-speedtest-orbit-card.js", import.meta.url), "utf8");
const registry = new Map();
const windowStub = { customCards: [] };
class HTMLElementStub {
  attachShadow() { this.shadowRoot = { innerHTML: "" }; return this.shadowRoot; }
}
const context = vm.createContext({
  HTMLElement: HTMLElementStub,
  Intl,
  Date,
  console: { info() {} },
  window: windowStub,
  customElements: { get: (name) => registry.get(name), define: (name, klass) => registry.set(name, klass) },
});
vm.runInContext(source, context);

const Card = registry.get("ha-speedtest-orbit-card");
assert.ok(Card, "registers the Lovelace card");
assert.equal(windowStub.customCards[0].type, "ha-speedtest-orbit-card");

const states = {
  "sensor.internet_download": { state: "932.44", last_changed: "2026-10-15T08:00:00Z", attributes: { friendly_name: "Internet Download", unit_of_measurement: "Mbit/s" } },
  "sensor.internet_upload": { state: "81.26", last_changed: "2026-10-15T08:00:00Z", attributes: { friendly_name: "Internet Upload", unit_of_measurement: "Mbit/s" } },
  "sensor.internet_latency": { state: "8.6", last_changed: "2026-10-15T08:00:00Z", attributes: { friendly_name: "Internet Ping", unit_of_measurement: "ms" } },
};
const card = new Card();
card.setConfig({ title: "Home <Network>", palette: "aurora" });
card.hass = {
  states,
  entities: Object.fromEntries(Object.keys(states).map((entity_id) => [entity_id, {
    entity_id,
    platform: "speedtestdotnet",
    original_name: states[entity_id].attributes.friendly_name,
  }])),
};
assert.match(card.shadowRoot.innerHTML, /932\.4/);
assert.match(card.shadowRoot.innerHTML, /81\.3/);
assert.match(card.shadowRoot.innerHTML, /<div class="metric-value ">9<span class="metric-unit">ms<\/span>/);
assert.match(card.shadowRoot.innerHTML, /Home &lt;Network&gt;/);
assert.match(card.shadowRoot.innerHTML, /data-palette="aurora"/);
card.hass = {
  ...card.hass,
  states: {
    ...states,
    "sensor.internet_download": { ...states["sensor.internet_download"], state: "850.2" },
  },
};
assert.match(card.shadowRoot.innerHTML, /<polyline points=/, "records a session trend after a measurement changes");

const explicit = new Card();
explicit.setConfig({
  auto_discover: false,
  download_entity: "sensor.internet_download",
  upload_entity: "sensor.internet_upload",
  ping_entity: "sensor.internet_latency",
});
explicit.hass = { states, entities: {} };
assert.match(explicit.shadowRoot.innerHTML, /932\.4/);

const unifiPing = new Card();
unifiPing.setConfig({});
unifiPing.hass = {
  states: {
    "sensor.unifi_speed_test_ping_secondary_wan": {
      state: "4.0",
      last_changed: "2026-10-15T08:00:00Z",
      attributes: { friendly_name: "UniFi Speed Test Ping Secondary WAN", unit_of_measurement: "ms" },
    },
  },
  entities: {},
};
assert.match(unifiPing.shadowRoot.innerHTML, /<div class="metric-value ">4<span class="metric-unit">ms<\/span>/, "auto-discovers a UniFi Speed Test ping sensor without speedtestdotnet registry metadata");

const unavailable = new Card();
unavailable.setConfig({ auto_discover: false });
unavailable.hass = { states: {}, entities: {} };
assert.match(unavailable.shadowRoot.innerHTML, /No Speedtest sensors found/);
assert.match(unavailable.shadowRoot.innerHTML, /class="pill "/);

console.log("Speedtest Orbit Card smoke checks passed.");
