import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, FileText, Brain, ArrowRight, Sparkles, GraduationCap } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/cards";

export default function Landing() {
  const features = [
    {
      icon: BookOpen,
      title: "Smart PDF Reader",
      description:
        "Upload and read PDFs with intelligent highlighting, annotations, and AI-powered Q&A assistance.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: FileText,
      title: "Testing Hub",
      description:
        "Generate custom quizzes, mock exams, and exercises from your study materials using advanced AI.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Brain,
      title: "Creative Thinking Tools",
      description:
        "Transform complex concepts into clear explanations, mind maps, and visual schemes for better understanding.",
      gradient: "from-indigo-500 to-purple-500",
    },
  ];

  const stats = [
    { value: "10K+", label: "Documents Analyzed" },
    { value: "50K+", label: "Quizzes Generated" },
    { value: "95%", label: "Student Satisfaction" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ExamFox
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              The ultimate AI-powered learning platform that transforms how you study, understand, and master complex
              materials through intelligent document analysis and creative thinking tools.
            </p>

            {/* ACTION BUTTONS (updated) */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/app">
                <Button
                  size="lg"
                  className="
                    group inline-flex items-center justify-center
                    rounded-2xl px-8 md:px-10 py-4 md:py-5
                    bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500
                    text-white text-xl md:text-2xl font-semibold
                    shadow-md hover:shadow-xl
                    ring-1 ring-indigo-400/30 hover:ring-indigo-400/50
                    transition-all duration-300
                  "
                >
                  Start Learning Now
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>

              <Button
                size="lg"
                variant="outline"
                className="
                  inline-flex items-center justify-center
                  rounded-2xl px-8 md:px-10 py-4 md:py-5
                  bg-white/40 hover:bg-white/60 backdrop-blur-sm
                  text-slate-700 text-xl md:text-2xl font-semibold
                  border border-slate-200/70
                  shadow-sm hover:shadow-md
                  ring-1 ring-slate-200/60
                  transition-all duration-300
                "
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white/60 backdrop-blur-sm border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Powerful Learning Tools</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Three comprehensive sections designed to revolutionize your learning experience with cutting-edge AI
            technology.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
              ></div>
              <CardContent className="relative p-8">
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-6">{feature.description}</p>
                <div className="flex items-center text-blue-600 font-semibold group-hover:text-purple-600 transition-colors duration-300">
                  <span>Explore Feature</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <Sparkles className="w-16 h-16 text-white mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Transform Your Learning?</h2>
            <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
              Join thousands of students and professionals who are already using ExamFox to accelerate their learning
              and achieve better results.
            </p>
            <Link to="/app">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Get Started for Free !
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">ExamFox</h3>
                <p className="text-slate-400 text-sm">Smart Learning Platform</p>
              </div>
            </div>
            <div className="text-slate-400 text-sm">© 2024 ExamFox. Empowering learners worldwide.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

