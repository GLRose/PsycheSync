"use client";

import type React from "react";

import {useState, useRef} from "react";
import {Upload, FileText, X, Loader2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {analyzePersonality} from "@/app/actions";

export default function FileUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFile = e.dataTransfer.files[0];
            handleFileSelection(droppedFile);
        }
    };

    const handleFileSelection = (selectedFile: File) => {
        // Check if file is a text or JSON file
        if (selectedFile.type === "application/json" || selectedFile.type === "text/plain" || selectedFile.name.endsWith(".json") || selectedFile.name.endsWith(".txt")) {
            setFile(selectedFile);
            setResult(null);
        } else {
            alert("Please upload a JSON or TXT file");
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileSelection(e.target.files[0]);
        }
    };

    const handleBrowseClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        setResult(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;

        setIsAnalyzing(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const analysisResult = await analyzePersonality(formData);
            setResult(analysisResult);
        } catch (error) {
            console.error("Analysis error:", error);
            setResult("An error occurred during analysis. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="w-full">
            <input type="file" ref={fileInputRef} onChange={handleFileInputChange} accept=".json,.txt" className="hidden" />

            {!file ? (
                <div className={`border-2 border-dashed ${isDragging ? "border-purple-600 bg-purple-50" : "border-gray-400"} rounded-lg p-8 text-center mb-6`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                    <Upload className="h-12 w-12 mx-auto mb-4" />
                    <p className="mb-4">Drag and drop your ChatGPT export file here</p>
                    <p className="text-sm text-gray-500 mb-4">Supported formats: .json, .txt</p>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-none" onClick={handleBrowseClick}>
                        Browse Files
                    </Button>
                </div>
            ) : (
                <div className="border-2 border-gray-400 rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <FileText className="h-8 w-8 mr-3 text-purple-600" />
                            <div>
                                <p className="font-bold">{file.name}</p>
                                <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={handleRemoveFile} className="rounded-full hover:bg-gray-100">
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <Button className="w-full bg-black hover:bg-gray-800 text-white font-bold py-4 text-xl rounded-none" onClick={handleAnalyze} disabled={isAnalyzing}>
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                ANALYZING...
                            </>
                        ) : (
                            "ANALYZE MY PERSONALITY"
                        )}
                    </Button>
                </div>
            )}

            {result && (
                <div className="mt-8 border-t-4 border-purple-600 pt-6">
                    <h3 className="text-2xl font-bold mb-4">YOUR PERSONALITY ANALYSIS</h3>
                    <div className="bg-gray-100 p-6 rounded-lg font-mono whitespace-pre-line">{result}</div>
                </div>
            )}

            <div className="mt-6 text-sm font-mono">
                <p>Your data is processed securely and privately. We never share your raw conversation data.</p>
            </div>
        </div>
    );
}
