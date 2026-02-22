# MLera - Interactive Machine Learning Platform

Learn machine learning by actually doing it. No boring lectures, no endless theory - just hands-on experimentation with real algorithms.

## What is This?

MLera is an interactive learning platform where you can train real ML models in your browser and watch them learn step-by-step. Think of it like a flight simulator for machine learning - you get to play with all the controls and see what happens without breaking anything.

The current focus is on **Linear Regression**, a fundamental algorithm that''s the foundation for understanding more complex models. You can adjust hyperparameters, watch gradient descent optimize in real-time, and actually understand what''s happening under the hood.

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:3000` and start playing around.

## The Machine Learning Model

### What We''re Training

**Simple Linear Regression** - Finding the best straight line to fit a dataset.

The model learns two parameters:
- **?** (theta0): The y-intercept - where the line crosses the y-axis
- **?** (theta1): The slope - how steep the line is

The goal is to find values that minimize prediction errors across all data points.

### How Training Works

We use **Batch Gradient Descent**, one of the most fundamental optimization algorithms in ML:

1. **Start with random guesses** (? = 0, ? = 0)

2. **Calculate the error** using the Mean Squared Error cost function:
   ```
   J(?) = (1/2m) S(h(x) - y)
   ```
   where h(x) = ? + ?x

3. **Update parameters** by moving in the direction that reduces error:
   ```
   ? := ? - a(1/m)S(h(x) - y)
   ? := ? - a(1/m)S((h(x) - y)x)
   ```

4. **Repeat** for a set number of iterations or until convergence

The **learning rate (a)** controls how big each step is. Too small and training takes forever. Too large and it might overshoot the optimal values and never converge.

### What You Can Adjust

- **Learning Rate**: How aggressive the optimization is (0.001 - 1.0)
- **Iterations**: How many times to update the parameters (1 - 10,000)
- **Dataset**: Different real-world scenarios (sales, salaries, house prices)

You can step through training iteration-by-iteration to see exactly how the model improves over time.

## Project Structure

```
app/
 page.tsx                           # Landing page
 linear-regression/page.tsx         # Main interactive learning interface
 logistic-regression/page.tsx       # Classification introduction
 neural-networks/page.tsx           # Neural network concepts
 learning-path/page.tsx             # Curriculum overview
 layout.tsx                         # Root layout with providers
 globals.css                        # Tailwind styles + custom CSS variables
 api/
     train/route.ts                 # POST endpoint for model training
     datasets/route.ts              # GET available datasets
     datasets/[name]/route.ts       # GET specific dataset
     prediction-line/route.ts       # POST calculate prediction line

components/
 layout/                            # Navbar, Footer, Breadcrumbs
 learning/                          # Charts, controls, visualizations
 shared/                            # Reusable UI components
 ui/                                # Base UI components (buttons, cards, etc.)

lib/
 linearRegression.ts                # Core ML algorithm implementation
 queryClient.ts                     # TanStack Query configuration
 utils.ts                           # Helper functions

hooks/
 useLinearRegression.ts             # Custom hook for training
 use-toast.ts                       # Toast notifications
 use-mobile.tsx                     # Responsive utilities

shared/
 schema.ts                          # TypeScript interfaces
```

## Tech Stack

- **Next.js 15** with App Router - Server components for fast initial loads
- **TypeScript** - Type safety throughout
- **Tailwind CSS** - Utility-first styling with custom design system
- **Recharts** - Interactive data visualizations
- **TanStack Query** - Smart data fetching and caching
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Smooth animations

## Features

 **Real Training** - Actual gradient descent implementation, not just animations  
 **Live Charts** - See cost function, parameters, and predictions update in real-time  
 **Interactive Controls** - Sliders, buttons, and keyboard shortcuts  
 **Multiple Datasets** - Practice on different real-world scenarios  
 **Step-by-Step Mode** - Navigate through training iteration by iteration  
 **Dark Mode** - Easy on the eyes with a sleek purple theme  
 **Server Components** - Fast page loads with Next.js server rendering  
 **Responsive** - Works on desktop, tablet, and mobile

## Deploy to Vercel

The easiest way to deploy is using Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/mlera)

Or manually:

1. Push your code to GitHub
2. Import your repo in [Vercel](https://vercel.com)
3. Vercel auto-detects Next.js and configures everything
4. Deploy!

No environment variables needed. No database setup. Just works.

### Vercel Configuration

The app is already optimized for Vercel:
- Automatic HTTPS
- Edge caching for API routes
- Server-side rendering for fast initial loads
- Static asset optimization

## Local Development

```bash
# Install dependencies
npm install

# Start dev server (runs on port 3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type check
npm run check
```

## What''s Next?

Future plans include:
- More algorithms (K-Means, Decision Trees, Neural Networks)
- Custom dataset upload
- Code export (get the Python/JavaScript equivalent)
- Progress tracking and achievements
- Community features

---

Built with curiosity by **Nithish A T**

If you find this helpful, star the repo. If you find bugs, well... that''s part of the learning experience
