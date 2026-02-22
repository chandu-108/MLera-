"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Lock } from "lucide-react";

export default function LearningPath() {
  const modules = [
    {
      id: 1,
      title: "Linear Regression",
      description: "Predicting numbers - How much? How many?",
      status: "available",
      link: "/linear-regression",
      topics: ["Gradient Descent", "Cost Function", "Hyperparameters"],
      realWorld: "House prices, Sales forecasting, Stock predictions",
      difficulty: "Beginner",
      duration: "30 min",
    },
    {
      id: 2,
      title: "Logistic Regression",
      description: "Making decisions - Yes or No?",
      status: "available",
      link: "/logistic-regression",
      topics: ["Classification", "Probability", "Decision Boundary"],
      realWorld: "Spam detection, Fraud detection, Customer churn",
      difficulty: "Beginner",
      duration: "25 min",
    },
    {
      id: 3,
      title: "Neural Networks",
      description: "The brain of AI - Pattern recognition",
      status: "available",
      link: "/neural-networks",
      topics: ["Layers", "Activation Functions", "Backpropagation"],
      realWorld: "Image recognition, Voice assistants, Game AI",
      difficulty: "Intermediate",
      duration: "45 min",
    },
    {
      id: 4,
      title: "Decision Trees",
      description: "Making choices step by step",
      status: "available",
      link: "/decision-trees",
      topics: ["Tree Structure", "Splitting", "Pruning"],
      realWorld: "Medical diagnosis, Credit scoring, Recommendations",
      difficulty: "Intermediate",
      duration: "35 min",
    },
    {
      id: 5,
      title: "Reinforcement Learning",
      description: "Learning by trial and error",
      status: "available",
      link: "/reinforcement-learning",
      topics: ["Rewards", "Policies", "Q-Learning"],
      realWorld: "Game playing, Robotics, Self-driving cars",
      difficulty: "Advanced",
      duration: "60 min",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />;
      case "available":
        return <Circle className="h-6 w-6 text-primary" />;
      case "locked":
        return <Lock className="h-6 w-6 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto max-w-7xl px-6 lg:px-8 py-12 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 md:text-6xl">
            Your Learning Path
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
            From beginner to expert - Master machine learning one concept at a time
          </p>
        </div>

        {/* Progress Overview */}
        <Card>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">1/5</div>
                <div className="text-sm text-muted-foreground">Modules Completed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">0%</div>
                <div className="text-sm text-muted-foreground">Progress</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">5</div>
                <div className="text-sm text-muted-foreground">Available Now</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">~3h</div>
                <div className="text-sm text-muted-foreground">Total Duration</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Learning Modules */}
        <div className="space-y-6">
          {modules.map((module, index) => (
            <Card
              key={module.id}
              className={`transition-all ${module.status === "locked"
                ? "opacity-60 cursor-not-allowed"
                : "hover:shadow-lg cursor-pointer"
                }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(module.status)}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <CardTitle className="text-2xl">
                          {index + 1}. {module.title}
                        </CardTitle>
                        <Badge className={getDifficultyColor(module.difficulty)}>
                          {module.difficulty}
                        </Badge>
                        <Badge variant="outline">{module.duration}</Badge>
                        {module.status === "completed" && (
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 border-green-300 dark:border-green-500/30">
                            ✓ Completed
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-base">
                        {module.description}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Topics */}
                <div>
                  <div className="text-sm font-semibold text-purple-300 mb-2">
                    What You'll Learn:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {module.topics.map((topic) => (
                      <Badge key={topic} variant="secondary">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Real World */}
                <div>
                  <div className="text-sm font-semibold text-foreground mb-2">
                    Real-World Applications:
                  </div>
                  <p className="text-sm text-muted-foreground">{module.realWorld}</p>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  {module.status === "completed" ? (
                    <Link href={module.link}>
                      <Button variant="outline" className="w-full sm:w-auto">
                        Review Module
                      </Button>
                    </Link>
                  ) : module.status === "available" ? (
                    <Link href={module.link}>
                      <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0">
                        Start Learning
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="ghost" disabled className="w-full sm:w-auto text-purple-400/50">
                      <Lock className="h-4 w-4 mr-2" />
                      Locked - Complete previous modules
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Completion Card */}
        <Card className="border-2 border-dashed border-purple-300 dark:border-purple-700">
          <CardContent className="p-8 text-center space-y-4">
            <div className="text-6xl">🎓</div>
            <h3 className="text-2xl font-bold">Complete All Modules to Earn Certificate!</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Finish all modules, pass the quizzes, and receive your Machine Learning
              Fundamentals certificate to showcase your skills!
            </p>
            <Button variant="default" disabled>
              View Certificate Requirements
            </Button>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/">
            <Button variant="outline" size="lg">
              Back to Home
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

