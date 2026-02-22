const fs = require('fs');
let c = fs.readFileSync('page.tsx', 'utf8');

c = c.replace(/function G\(\{ children, className \}\) \{/, 'function G({ children, className }: { children: React.ReactNode; className?: string }) {');
c = c.replace(/function Reveal\(\{ children, delay = 0, y = 40, x = 0, className \}\) \{/, 'function Reveal({ children, delay = 0, y = 40, x = 0, className }: { children: React.ReactNode; delay?: number; y?: number; x?: number; className?: string }) {');
c = c.replace(/function NeuralLogo\(\{ size = 32 \}\) \{/, 'function NeuralLogo({ size = 32 }: { size?: number }) {');
c = c.replace(/function ProgressBar\(\{ current = 3, total = 5 \}\) \{/, 'function ProgressBar({ current = 3, total = 5 }: { current?: number; total?: number }) {');
c = c.replace(/function Card\(\{ children, delay = 0, glow = false, className \}\) \{/, 'function Card({ children, delay = 0, glow = false, className }: { children: React.ReactNode; delay?: number; glow?: boolean; className?: string }) {');
c = c.replace(/function SectionHeader\(\{ number, title, subtitle \}\) \{/, 'function SectionHeader({ number, title, subtitle }: { number: number; title: string; subtitle?: string }) {');
c = c.replace(/function SigmoidChart\(\{ highlightX = 0, animated = true \}\) \{/, 'function SigmoidChart({ highlightX = 0, animated = true }: { highlightX?: number; animated?: boolean }) {');
c = c.replace(/function GradSlider\(\{ label, value, min, max, step, onChange \}\) \{/, 'function GradSlider({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {');
c = c.replace(/function ProbGauge\(\{ probability \}\) \{/, 'function ProbGauge({ probability }: { probability: number }) {');
c = c.replace(/function UseCaseCard\(\{ icon, title, desc, examples, delay = 0 \}\) \{/, 'function UseCaseCard({ icon, title, desc, examples, delay = 0 }: { icon: React.ReactNode; title: string; desc: string; examples: {label: string; result: string}[]; delay?: number }) {');
c = c.replace(/function Step\(\{ num, title, desc, delay = 0, isLast = false \}\) \{/, 'function Step({ num, title, desc, delay = 0, isLast = false }: { num: number; title: string; desc: string; delay?: number; isLast?: boolean }) {');

c = c.replace(/const sigmoid = x =>/, 'const sigmoid = (x: number) =>');
c = c.replace(/const px = x =>/g, 'const px = (x: number) =>');
c = c.replace(/const py = y =>/g, 'const py = (y: number) =>');
c = c.replace(/const pyLinear = y =>/g, 'const pyLinear = (y: number) =>');
c = c.replace(/const pyLogistic = y =>/g, 'const pyLogistic = (y: number) =>');
c = c.replace(/const arcPath = \(startAngle, endAngle, radius\) =>/g, 'const arcPath = (startAngle: number, endAngle: number, radius: number) =>');

c = c.replace(/const \[active, setActive\] = useState\(\{\}\);/g, 'const [active, setActive] = useState<Record<string, boolean>>({});');

c = c.replace(/const cn = \(\.\.\.c\) =>/g, 'const cn = (...c: any[]) =>');

fs.writeFileSync('page.tsx', c);
console.log("Types updated");
