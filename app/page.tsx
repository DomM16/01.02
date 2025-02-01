"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Editor } from '@/components/editor'
import { analyzeCode } from "@/lib/groq"
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { GithubIcon, Settings } from "lucide-react"
import { BookOpen, Sparkles, Bug, Plus } from "lucide-react"
import { TypewriterText } from "@/components/typewriter-text"
import { LoadingAnimation } from "@/components/loading-animation"

const ANALYSIS_MODES = [
  { 
    value: "explain", 
    label: "Explain code",
    subModes: [
      { value: "brief", label: "Brief overview" },
      { value: "detailed", label: "In-depth analysis" }
    ]
  },
  { value: "improve", label: "Improve code" },
  { value: "debug", label: "Debug code" },
  { value: "expand", label: "Expand functionality" },
]

export default function Home() {
  const [code, setCode] = useState("")
  const [analysis, setAnalysis] = useState("")
  const [mode, setMode] = useState<string>("explain")
  const [subMode, setSubMode] = useState<string>("brief")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isCommenting, setIsCommenting] = useState(false)

  const selectedMode = ANALYSIS_MODES.find(m => m.value === mode)

  const handleAnalyze = async () => {
    try {
      setIsAnalyzing(true)
      const result = await analyzeCode(code, mode, subMode)
      setAnalysis(result || "No analysis available")
    } catch (error) {
      console.error("Analysis error:", error)
      setAnalysis("Error analyzing code")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <motion.header 
        className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="container flex h-16 items-center gap-4">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-primary/10 p-2 rounded-lg">
              <div className="font-bold text-primary">CA</div>
            </div>
            <div className="font-semibold">Code Analysis</div>
          </motion.div>

          <div className="flex items-center gap-2 ml-8">
            <Select value={mode} onValueChange={(value) => {
              setMode(value)
              setSubMode("brief")
            }}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                {ANALYSIS_MODES.map((mode) => (
                  <SelectItem key={mode.value} value={mode.value}>
                    <div className="flex items-center gap-2">
                      {mode.value === 'explain' && <BookOpen className="w-4 h-4" />}
                      {mode.value === 'improve' && <Sparkles className="w-4 h-4" />}
                      {mode.value === 'debug' && <Bug className="w-4 h-4" />}
                      {mode.value === 'expand' && <Plus className="w-4 h-4" />}
                      {mode.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedMode?.subModes && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Select value={subMode} onValueChange={setSubMode}>
                  <SelectTrigger className="w-[150px] bg-white">
                    <SelectValue placeholder="Select depth" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedMode.subModes.map((subMode) => (
                      <SelectItem key={subMode.value} value={subMode.value}>
                        {subMode.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
            )}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <GithubIcon className="w-4 h-4 mr-2" />
              Star on GitHub
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsCommenting(!isCommenting)}>
              {isCommenting ? "Cancel Comment" : "Add Comment"}
            </Button>
          </div>
        </div>
      </motion.header>

      <motion.main 
        className="container py-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Code Analysis</h2>
              <Button 
                variant={isCommenting ? "secondary" : "ghost"}
                onClick={() => setIsCommenting(!isCommenting)}
              >
                {isCommenting ? "Cancel Comment" : "Add Comment"}
              </Button>
              <Button 
                onClick={handleAnalyze} 
                disabled={isAnalyzing || isCommenting}
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Code"}
              </Button>
            </div>
            <Editor 
              value={code} 
              onChange={(value: string | undefined) => setCode(value || '')}
              placeholder="Paste your code here..."
              isCommentingEnabled={isCommenting}
              onCommentComplete={() => setIsCommenting(false)}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Analysis Results</h2>
              <span className="text-sm text-muted-foreground">JSX</span>
            </div>
            <div className="min-h-[600px] rounded-lg border">
              <Tabs defaultValue="result">
                <TabsList className="w-full justify-start rounded-none border-b">
                  <TabsTrigger value="result">Result</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                </TabsList>
                <TabsContent value="result" className="p-4">
                  {isAnalyzing ? (
                    <LoadingAnimation />
                  ) : analysis ? (
                    <TypewriterText content={analysis} speed={10} />
                  ) : (
                    <div className="text-muted-foreground text-sm">
                      Analysis results will appear here...
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="performance" className="p-4">
                  Performance metrics will appear here...
                </TabsContent>
                <TabsContent value="suggestions" className="p-4">
                  Code suggestions will appear here...
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </motion.main>
    </div>
  )
}

