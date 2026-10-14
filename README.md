# Speedtest Orbit Card

A theme-aware Home Assistant Lovelace card for Speedtest.net measurements, styled as a compact network observatory to match the UniFi Orbit card.

## Features

- Download, upload, and ping values from Home Assistant sensor entities
- Automatic discovery of Speedtest.net sensors, with explicit entity selection when preferred
- Session-only mini trends; no history API calls or stored data
- Last measurement time from the selected sensor states
- Responsive Aurora, Ocean, Sunset, and Lavender palettes
- No direct Speedtest.net requests, credentials, backend integration, or external runtime dependencies

The official [Home Assistant Speedtest.net integration](https://www.home-assistant.io/integrations/speedtestdotnet/) provides ping (ms), download (Mbit/s), and upload (Mbit/s) sensors. This card reads only their Home Assistant frontend state.

## Install with HACS

1. In HACS, open **Frontend** and select the three-dot menu → **Custom repositories**.
2. Add `Liionboy/ha-speedtest-orbit-card` with category **Dashboard**.
3. Install **Speedtest Orbit Card** and reload the browser.
4. Add the card from the dashboard card picker.

## Configuration

With the official entity IDs, automatic discovery usually requires no additional settings:

```yaml
type: custom:ha-speedtest-orbit-card
title: Internet Speed
palette: ocean
```

If automatic discovery is unavailable or the entities have custom names, select them in the visual editor:

```yaml
type: custom:ha-speedtest-orbit-card
title: Internet Speed
palette: aurora # aurora, ocean, sunset, lavender
download_entity: sensor.speedtest_download
upload_entity: sensor.speedtest_upload
ping_entity: sensor.speedtest_ping
```

Entity IDs above are examples only; use entities that exist in your Home Assistant instance. `download_entity`, `upload_entity`, and `ping_entity` are optional when auto-discovery is enabled. No test is triggered by the card: it presents the latest values produced by the integration.

## License

MIT
