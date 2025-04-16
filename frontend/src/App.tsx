import { useState } from 'react'
import { Button } from './components/ui/button'
import { Textarea } from './components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { generateInsightFromQuery } from './ai/flows/generate-insight-from-query'
import { summarizeInsights } from './ai/flows/summarize-insights'
import { generateIndustryTrendInsights } from './ai/flows/generate-industry-trend-insights'
import { toast } from "./hooks/use-toast"
import { Toaster } from "./components/ui/toaster"
import { Copy, Save } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select"

const mockClients = [
  { value: "Addisu", label: "Addisu" },
  { value: "Bereket", label: "Bereket" },
  { value: "Chala", label: "Chala" },
]

export default function App() {
  const [prompt, setPrompt] = useState('')
  const [query, setQuery] = useState('')
  const [queryResult, setQueryResult] = useState('')
  const [insights, setInsights] = useState('')
  const [summary, setSummary] = useState('')
  const [industryTrends, setIndustryTrends] = useState('')
  const [loading, setLoading] = useState(false)
  const [clientName, setClientName] = useState(mockClients[0].value)

  const handleGenerateInsights = async () => {
    setLoading(true)
    try {
      if (!clientName) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please select a client.",
        })
        return
      }

      const insightData = await generateInsightFromQuery({
        question: prompt,
        clientName: clientName
      })
      
      setQuery(insightData.query)
      setQueryResult(insightData.queryResult)
      setInsights(insightData.insights)

      const summaryData = await summarizeInsights({
        insights: insightData.insights
      })
      setSummary(summaryData.summary)

      const industryTrendsData = await generateIndustryTrendInsights({
        clientDataDescription: 'Nonprofit client data',
        query: prompt,
      })
      setIndustryTrends(industryTrendsData.insights)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCopyInsights = () => {
    navigator.clipboard.writeText(insights)
    toast({
      title: "Copied!",
      description: "Insights copied to clipboard.",
    })
  }

  return (
    <div className="container mx-auto p-4 flex flex-col gap-4">
      <Toaster />
      <Card>
        <CardHeader>
          <CardTitle>Insightful Advisor</CardTitle>
          <CardDescription>Enter your prompt to generate insights.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Select onValueChange={setClientName} defaultValue={clientName}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              {mockClients.map((client) => (
                <SelectItem key={client.value} value={client.value}>
                  {client.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea
            placeholder="Enter your prompt here."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button onClick={handleGenerateInsights} disabled={loading}>
            {loading ? 'Loading...' : 'Generate Insights'}
          </Button>
        </CardContent>
      </Card>

      {insights && (
        <Card>
          <CardHeader className="flex flex-row justify-between">
            <CardTitle>Insights</CardTitle>
            <div className="space-x-2">
              <Button variant="secondary" size="sm" onClick={handleCopyInsights}>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
              <Button variant="secondary" size="sm">
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap">{insights}</pre>
          </CardContent>
        </Card>
      )}

      {summary && (
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>A concise summary of the insights.</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap">{summary}</pre>
          </CardContent>
        </Card>
      )}

      {industryTrends && (
        <Card>
          <CardHeader>
            <CardTitle>Industry Trends</CardTitle>
            <CardDescription>Industry trend insights related to the client's data.</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap">{industryTrends}</pre>
          </CardContent>
        </Card>
      )}

      {query && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Query</CardTitle>
            <CardDescription>The SQL query generated from your prompt.</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap">{query}</pre>
          </CardContent>
        </Card>
      )}

      {queryResult && (
        <Card>
          <CardHeader>
            <CardTitle>Query Result</CardTitle>
            <CardDescription>The result of the SQL query.</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap">{queryResult}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
