# ANIMAL BONK! — Core Prototype

A touch-first Three.js + Rapier 3D prototype. Tap a specific part of the cartoon pig to send a first-person boxing glove toward the exact hit point, then watch an 11-body physics ragdoll react to the impact.

## Run

Install and run locally:

```shell
npm install
npm run dev
```

Production build:

```shell
npm run build
```

Controls: click or tap targets. Head, torso, and leg impacts generate different impulses; crates and walls take damage and break into physical debris. Use **Restart** to reset. Add `?debug` for diagnostics, `?debug&level=2` to inspect the surprise-wall level directly, `?debug&autohit=head` for an automated head-target ray, or `?debug&level=2&autohit=wall` to exercise the two-hit wall.

All visuals are generated procedurally at runtime; there are no external art dependencies. This milestone includes the first two complete levels, environment collisions, breakable crates, a breakable surprise wall, capped debris, and rapid level transitions.
