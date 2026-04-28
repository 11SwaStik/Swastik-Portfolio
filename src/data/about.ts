import type { TerminalLine } from "./types";

export const aboutParagraphs = [
  'I\'m <strong>Swastik</strong> — security engineer, lab builder, and the person who treats every system as something to be understood from the inside out. Root access to my sanity.',
  'At <span class="text-green">Scaler</span>, I manage AWS infrastructure for learners — building custom AMIs, designing IAM policies, and architecting hands-on Linux and Windows labs where people actually learn by doing, not watching.',
  'Before that I built <strong>AgniShield</strong> — a browser-based firewall that lets an admin block harmful sites, log employee traffic, restrict IPs and DNS, all from a single extension. It won <strong class="text-green">1st place</strong> at our college project showcase.',
  'I led content at my college\'s cybersecurity club. This portfolio exists because I\'d rather show work than talk about it.',
];

export const terminalLines: TerminalLine[] = [
  { html: '<span class="text-green">root@kirmada:~# </span><span class="text-text-dim">cat identity.json</span>', delay: 0 },
  { html: "&nbsp;", delay: 350 },
  { html: '<span class="text-text-dim">{</span>', delay: 600 },
  { html: '<span class="text-text-dim">  "name"     : </span><span class="text-text">"Swastik Sharma"</span><span class="text-text-dim">,</span>', delay: 800 },
  { html: '<span class="text-text-dim">  "alias"    : </span><span class="text-green">"kirmada"</span><span class="text-text-dim">,</span>', delay: 1000 },
  { html: '<span class="text-text-dim">  "role"     : </span><span class="text-text">"SME Cybersecurity @ Scaler"</span><span class="text-text-dim">,</span>', delay: 1200 },
  { html: '<span class="text-text-dim">  "builds"   : </span><span class="text-text">["firewalls", "labs", "tools"]</span><span class="text-text-dim">,</span>', delay: 1400 },
  { html: '<span class="text-text-dim">  "won"      : </span><span class="text-green">"1st — Project Showcase"</span><span class="text-text-dim">,</span>', delay: 1600 },
  { html: '<span class="text-text-dim">  "status"   : </span><span class="text-green">"active"</span>', delay: 1800 },
  { html: '<span class="text-text-dim">}</span>', delay: 2000 },
  { html: "&nbsp;", delay: 2150 },
  { html: '<span class="text-green">root@kirmada:~# </span><span class="inline-block w-[7px] h-[13px] bg-green align-middle animate-[blink-cursor_.9s_step-end_infinite]"></span>', delay: 2300 },
];
