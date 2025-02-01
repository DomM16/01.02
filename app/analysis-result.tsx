"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AnalysisResult() {
  return (
    <Card>
      <CardHeader className="border-b bg-muted/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Analysis Results</CardTitle>
          <Badge variant="secondary">JSX</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="suggestions">
          <TabsList className="grid grid-cols-3 h-12 rounded-none border-b">
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          <TabsContent value="suggestions" className="p-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Code Suggestions</h3>
              <ul>
                <li>Use memoization to prevent unnecessary recalculations</li>
                <li>Implement debouncing for the analysis function</li>
                <li>Add error boundaries for better error handling</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

