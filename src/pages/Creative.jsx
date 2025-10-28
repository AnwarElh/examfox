import React, { useState } from "react";
import { Brain, Lightbulb, GitBranch, RefreshCw, Sparkles, Copy } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/cards";
import { Textarea } from "../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { InvokeLLM } from "../integrations/Core";
import { CreativeOutput } from "../entities/CreativeOutput";
import { Skeleton } from "../components/ui/skeleton";

export default function CreativeTools() {
  const [inputText, setInputText] = useState("");
  const [outputType, setOutputType] = useState("rephrase");
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState({});

  const tools = [
    {
      id: "rephrase",
      title: "Text Rephrasing",
      description: "Make complex text clearer and more understandable",
      icon: RefreshCw,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      id: "mindmap",
      title: "Mind Map",
      description: "Create visual mind maps from concepts",
      icon: GitBranch,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      id: "scheme",
      title: "Visual Scheme",
      description: "Generate structured visual explanations",
      icon: Brain,
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      id: "explanation",
      title: "Concept Explanation",
      description: "Break down complex ideas into simple parts",
      icon: Lightbulb,
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const processText = async (type) => {
    if (!inputText.trim()) return;

    setIsProcessing(true);
    try {
      let prompt = "";
      let schema = {};

      switch (type) {
        case "rephrase":
          prompt = `Please rephrase the following text to make it clearer, more concise, and easier to understand while maintaining all the important information:\n\n${inputText}`;
          schema = {
            type: "object",
            properties: {
              original_complexity: { type: "string" },
              rephrased_text: { type: "string" },
              key_improvements: { type: "array", items: { type: "string" } }
            }
          };
          break;

        case "mindmap":
          prompt = `Create a mind map structure from the following text. Break it down into main topics, subtopics, and key points:\n\n${inputText}`;
          schema = {
            type: "object",
            properties: {
              central_topic: { type: "string" },
              main_branches: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    subtopics: { type: "array", items: { type: "string" } }
                  }
                }
              }
            }
          };
          break;

        case "scheme":
          prompt = `Create a visual scheme or flowchart structure from the following content. Show relationships, processes, or hierarchies:\n\n${inputText}`;
          schema = {
            type: "object",
            properties: {
              scheme_type: { type: "string" },
              elements: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    title: { type: "string" },
                    description: { type: "string" },
                    connections: { type: "array", items: { type: "string" } }
                  }
                }
              }
            }
          };
          break;

        case "explanation":
          prompt = `Break down the following complex concept into simple, easy-to-understand explanations with examples:\n\n${inputText}`;
          schema = {
            type: "object",
            properties: {
              simplified_explanation: { type: "string" },
              key_concepts: { type: "array", items: { type: "string" } },
              examples: { type: "array", items: { type: "string" } },
              analogies: { type: "array", items: { type: "string" } }
            }
          };
          break;
      }

      const response = await InvokeLLM({
        prompt,
        response_json_schema: schema
      });

      const output = await CreativeOutput.create({
        title: `${tools.find(t => t.id === type).title} - ${new Date().toLocaleDateString()}`,
        original_text: inputText,
        output_type: type,
        result: JSON.stringify(response),
        visual_data: response
      });

      setResults(prev => ({
        ...prev,
        [type]: response
      }));

    } catch (error) {
      console.error("Error processing text:", error);
    }
    setIsProcessing(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const renderResult = (type, data) => {
    if (!data) return null;

    switch (type) {
      case "rephrase":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h4 className="font-semibold text-slate-800">Rephrased Text</h4>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(data.rephrased_text)}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-slate-700 leading-relaxed">{data.rephrased_text}</p>
            </div>
            {data.key_improvements && (
              <div>
                <h5 className="font-medium text-slate-800 mb-2">Key Improvements</h5>
                <div className="space-y-1">
                  {data.key_improvements.map((improvement, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-slate-600">{improvement}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "mindmap":
        return (
          <div className="space-y-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold mb-6">
                {data.central_topic}
              </div>
            </div>
            <div className="grid gap-4">
              {data.main_branches?.map((branch, index) => (
                <Card key={index} className="border border-purple-200">
                  <CardContent className="p-4">
                    <h5 className="font-semibold text-purple-800 mb-3">{branch.title}</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {branch.subtopics?.map((subtopic, subIndex) => (
                        <Badge key={subIndex} variant="outline" className="justify-start">
                          {subtopic}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case "scheme":
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <Badge className="bg-indigo-100 text-indigo-800">{data.scheme_type}</Badge>
            </div>
            <div className="space-y-4">
              {data.elements?.map((element, index) => (
                <Card key={element.id || index} className="border border-indigo-200">
                  <CardContent className="p-4">
                    <h5 className="font-semibold text-indigo-800 mb-2">{element.title}</h5>
                    <p className="text-slate-600 text-sm mb-3">{element.description}</p>
                    {element.connections && element.connections.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-slate-500 mr-2">Connects to:</span>
                        {element.connections.map((connection, connIndex) => (
                          <Badge key={connIndex} variant="outline" className="text-xs">
                            {connection}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case "explanation":
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-slate-800 mb-3">Simplified Explanation</h4>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-slate-700 leading-relaxed">{data.simplified_explanation}</p>
              </div>
            </div>
            
            {data.key_concepts && (
              <div>
                <h5 className="font-medium text-slate-800 mb-2">Key Concepts</h5>
                <div className="grid gap-2">
                  {data.key_concepts.map((concept, index) => (
                    <Badge key={index} variant="outline" className="justify-start p-2">
                      {concept}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {data.examples && (
              <div>
                <h5 className="font-medium text-slate-800 mb-2">Examples</h5>
                <div className="space-y-2">
                  {data.examples.map((example, index) => (
                    <div key={index} className="bg-slate-50 rounded-lg p-3">
                      <p className="text-slate-700 text-sm">{example}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Creative Thinking Tools</h1>
          <p className="text-slate-600">Transform complex concepts into clear, visual explanations using AI.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="shadow-xl border-0">
            <CardHeader className="border-b border-slate-200">
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                Input Text or Concept
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Textarea
                placeholder="Enter any complex text, concept, question, or statement that you want to transform or explain better..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[200px] resize-none mb-6"
              />
              
              <div className="grid grid-cols-2 gap-4">
                {tools.map((tool) => (
                  <Button
                    key={tool.id}
                    onClick={() => processText(tool.id)}
                    disabled={!inputText.trim() || isProcessing}
                    className={`h-auto p-4 bg-gradient-to-r ${tool.gradient} hover:opacity-90 flex flex-col items-center gap-2`}
                  >
                    {isProcessing && outputType === tool.id ? (
                      <Skeleton className="w-6 h-6" />
                    ) : (
                      <tool.icon className="w-6 h-6" />
                    )}
                    <span className="text-sm font-medium text-center">{tool.title}</span>
                  </Button>
                ))}
              </div>

              {inputText && (
                <div className="mt-4 bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600">
                    Input length: <span className="font-medium">{inputText.length} characters</span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="shadow-xl border-0">
            <CardHeader className="border-b border-slate-200">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Generated Results
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {Object.keys(results).length > 0 ? (
                <Tabs defaultValue={Object.keys(results)[0]} className="w-full">
                  <TabsList className="grid w-full grid-cols-4 rounded-none bg-slate-50">
                    {Object.keys(results).map((type) => {
                      const tool = tools.find(t => t.id === type);
                      return (
                        <TabsTrigger key={type} value={type} className="text-xs">
                          {tool?.title.split(' ')[0]}
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                  {Object.entries(results).map(([type, data]) => (
                    <TabsContent key={type} value={type} className="p-6">
                      {renderResult(type, data)}
                    </TabsContent>
                  ))}
                </Tabs>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">No Results Yet</h3>
                  <p className="text-slate-600">
                    Enter some text and select a creative tool to see AI-generated results here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}