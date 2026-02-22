import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const hyperparameters = [
  {
    learningRate: "0.001 - 0.005",
    iterations: "300 - 500",
    effect: "Slow, stable convergence (good for complex datasets)",
  },
  {
    learningRate: "0.01 - 0.05",
    iterations: "100 - 300",
    effect: "Balanced convergence (recommended starting point)",
  },
  {
    learningRate: "0.05 - 0.1",
    iterations: "50 - 100",
    effect: "Fast convergence, potential instability (for simple datasets)",
  },
];

export default function HyperparameterTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-card-border shadow-lg">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-600 hover:to-pink-600">
            <TableHead className="text-white font-semibold" data-testid="heading-learning-rate">
              Learning Rate (α)
            </TableHead>
            <TableHead className="text-white font-semibold" data-testid="heading-iterations">
              Iterations
            </TableHead>
            <TableHead className="text-white font-semibold" data-testid="heading-effect">Effect</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hyperparameters.map((param, index) => (
            <TableRow
              key={index}
              className="hover-elevate"
              data-testid={`row-hyperparameter-${index}`}
            >
              <TableCell className="font-mono text-sm" data-testid={`cell-learning-rate-${index}`}>
                {param.learningRate}
              </TableCell>
              <TableCell className="font-mono text-sm" data-testid={`cell-iterations-${index}`}>
                {param.iterations}
              </TableCell>
              <TableCell className="text-sm" data-testid={`cell-effect-${index}`}>{param.effect}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
