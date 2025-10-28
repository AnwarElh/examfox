import React, { useState, useRef } from "react";
import { 
    Upload, 
    MessageCircle, 
    Highlighter, 
    FileText, 
    Send, 
    Sparkles,
    Search,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/cards";
import { Textarea } from "../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { UploadFile, ExtractDataFromUploadedFile, InvokeLLM } from "../integrations/Core";
import { Document } from "../entities/Document";
import { Skeleton } from "../components/ui/skeleton";

export default function PdfReader() {
  const [currentDocument, setCurrentDocument] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || file.type !== "application/pdf") {
      return;
    }

    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setPdfUrl(file_url);

      const extractResult = await ExtractDataFromUploadedFile({
        file_url,
        json_schema: {
          type: "object",
          properties: {
            content: { type: "string" }
          }
        }
      });

      if (extractResult.status === "success") {
        const document = await Document.create({
          title: file.name,
          file_url,
          file_type: "pdf",
          content: extractResult.output.content || "",
          annotations: []
        });
        setCurrentDocument(document);
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
    }
    setIsUploading(false);
  };

  const handleAskAI = async () => {
    if (!aiQuestion.trim() || !currentDocument || isAsking) return;

    setIsAsking(true);
    try {
      const response = await InvokeLLM({
        prompt: `Based on the following document content, please answer this question: "${aiQuestion}"\n\nDocument content: ${currentDocument.content}`,
        response_json_schema: {
          type: "object",
          properties: {
            answer: { type: "string" },
            confidence: { type: "string" }
          }
        }
      });
      setAiAnswer(response.answer);
    } catch (error) {
      console.error("Error asking AI:", error);
      setAiAnswer("Sorry, I couldn't process your question. Please try again.");
    }
    setIsAsking(false);
  };

  const PreUploadView = () => (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Smart PDF Reader</h1>
        <p className="text-slate-500 mb-12">Upload your PDF, highlight any part, and get the exact answer you need.</p>
        <div 
            className="w-full max-w-2xl border-2 border-dashed border-slate-300 rounded-2xl p-8 cursor-pointer hover:bg-slate-50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
        >
            <div className="flex flex-col items-center justify-center space-y-4">
                <FileText className="w-16 h-16 text-blue-600"/>
                <p className="text-slate-600 font-medium">Drag and drop your PDF here, or click to browse</p>
                <div className="bg-slate-100/70 rounded-lg p-6 w-full max-w-sm mt-4">
                    <div className="flex flex-col items-center justify-center space-y-2">
                         <Upload className="w-8 h-8 text-blue-500"/>
                         <p className="font-semibold text-slate-700">Click to browse files</p>
                         <p className="text-xs text-slate-500">Allowed file types: PDF</p>
                         <p className="text-xs text-slate-500">Max file size: 20 MB</p>
                    </div>
                </div>
            </div>
        </div>
        <input
            ref={fileInputRef}
            id="pdf-upload"
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
        />
    </div>
  );

  const PostUploadView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 p-6 h-full">
        {/* PDF Viewer */}
        <div className="lg:col-span-3 h-full flex flex-col bg-white rounded-2xl shadow-lg">
            <div className="flex items-center justify-between p-3 border-b border-slate-200">
                <span className="font-medium text-sm text-slate-700 truncate px-2">{currentDocument.title}</span>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="w-8 h-8"><ChevronLeft className="w-4 h-4"/></Button>
                        <span className="text-sm text-slate-600">1 / 10</span>
                        <Button variant="ghost" size="icon" className="w-8 h-8"><ChevronRight className="w-4 h-4"/></Button>
                    </div>
                    <div className="w-px h-6 bg-slate-200"></div>
                    <span className="text-sm text-slate-600">100%</span>
                    <Button variant="ghost" size="icon" className="w-8 h-8"><Search className="w-4 h-4"/></Button>
                </div>
            </div>
            <div className="flex-1 overflow-hidden">
                 <iframe
                    src={pdfUrl}
                    className="w-full h-full border-0"
                    title="PDF Document"
                />
            </div>
        </div>
        {/* Study Tools */}
        <div className="lg:col-span-2 h-full flex flex-col bg-white rounded-2xl shadow-lg">
            <Tabs defaultValue="ai" className="h-full flex flex-col">
                <div className="p-3 border-b border-slate-200">
                    <h3 className="font-semibold text-slate-800 px-2 mb-2">Study Tools</h3>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="notes">Notes</TabsTrigger>
                        <TabsTrigger value="ai">Ask AI</TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value="notes" className="flex-1 overflow-y-auto p-4 m-0">
                    <div className="text-center py-10 text-slate-500">
                        <Highlighter className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                        <h4 className="font-semibold text-slate-700">Notes & Highlights</h4>
                        <p className="text-sm mt-2">Select text in the document to create notes and highlights.</p>
                    </div>
                </TabsContent>
                <TabsContent value="ai" className="flex-1 flex flex-col overflow-y-auto m-0">
                    <div className="p-4 space-y-3">
                         <Textarea
                            placeholder="Ask any question about the document..."
                            value={aiQuestion}
                            onChange={(e) => setAiQuestion(e.target.value)}
                            className="min-h-[100px] resize-none text-sm"
                            disabled={!currentDocument}
                        />
                        <Button
                            onClick={handleAskAI}
                            disabled={!currentDocument || !aiQuestion.trim() || isAsking}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                            {isAsking ? 'Analyzing...' : 'Ask AI'}
                        </Button>
                    </div>
                     {aiAnswer && (
                        <div className="p-4 border-t border-slate-200">
                             <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2"><MessageCircle className="w-5 h-5"/> AI Response</h4>
                             <div className="prose prose-sm max-w-none text-slate-700 text-sm bg-purple-50/50 p-3 rounded-md">
                                {aiAnswer}
                            </div>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    </div>
  );

  return (
  <div id="pdf-reader" className="min-h-screen w-full scroll-mt-24 pt-8">
    {isUploading ? (
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="w-24 h-24 rounded-full" />
        <p className="text-slate-600 font-medium">Uploading and processing your document...</p>
      </div>
    ) : currentDocument ? (
      <PostUploadView />
    ) : (
      <PreUploadView />
    )}
  </div>
);

}