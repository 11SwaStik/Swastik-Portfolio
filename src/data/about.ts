import type { TerminalLine } from "./types";

export const aboutParagraphs = [
  'Cybersecurity SME Intern at <span class="text-green">Scaler</span>. I build cloud security labs — privilege escalation, misconfigurations, real-world attack scenarios — with custom AMIs, scoped IAM, and isolated Linux and Windows ranges that boot fresh per session.',
  'The whole point is letting students do things they\'re not supposed to do anywhere else. So far the host account is still standing.',
];

export const terminalLines: TerminalLine[] = [
  { html: '<span class="text-green">root@kirmada:~# </span><span class="text-text-dim">cat identity.json</span>', delay: 0 },
  { html: "&nbsp;", delay: 350 },
  { html: '<span class="text-text-dim">{</span>', delay: 600 },
  { html: '<span class="text-text-dim">  "name"     : </span><span class="text-text">"Swastik Sharma"</span><span class="text-text-dim">,</span>', delay: 800 },
  { html: '<span class="text-text-dim">  "alias"    : </span><span class="text-green">"kirmada"</span><span class="text-text-dim">,</span>', delay: 1000 },
  { html: '<span class="text-text-dim">  "role"     : </span><span class="text-text">"Cybersecurity SME Intern @ Scaler"</span><span class="text-text-dim">,</span>', delay: 1200 },
  { html: '<span class="text-text-dim">  "builds"   : </span><span class="text-text">["firewalls", "labs", "tools"]</span><span class="text-text-dim">,</span>', delay: 1400 },
  { html: '<span class="text-text-dim">  "won"      : </span><span class="text-green">"1st — Project Showcase"</span><span class="text-text-dim">,</span>', delay: 1600 },
  { html: '<span class="text-text-dim">  "status"   : </span><span class="text-green">"active"</span>', delay: 1800 },
  { html: '<span class="text-text-dim">}</span>', delay: 2000 },
  { html: "&nbsp;", delay: 2150 },
];
