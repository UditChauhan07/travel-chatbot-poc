'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Plane } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import type { FlightPreferences, FlightResponse } from '../types/flight'

interface FlightSearchFormProps {
  onResults: (results: FlightResponse) => void
}
export function FlightSearchForm({ onResults }: FlightSearchFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [preferences, setPreferences] = useState<FlightPreferences>({
    budget: '',
    class: 'economy',
    directFlight: false,
    flexibleDates: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('Submitting form with data:', { origin, destination, preferences })

      const response = await fetch('/api/flight-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin, destination, preferences }),
      })

      console.log('Received response:', response)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Parsed response data:', data)

      if (data.error) {
        throw new Error(data.error)
      }

      if (!data.suggestions || !Array.isArray(data.suggestions) || !data.summary) {
        throw new Error('Invalid response format')
      }

      onResults(data)
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to get flight suggestions'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plane className="h-6 w-6" />
          Find Your Perfect Flight
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="origin">Origin</Label>
              <Input
                id="origin"
                placeholder="Enter city or airport"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                placeholder="Enter city or airport"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="budget">Budget (USD)</Label>
              <Input
                id="budget"
                type="number"
                placeholder="Enter your maximum budget"
                value={preferences.budget}
                onChange={(e) =>
                  setPreferences({ ...preferences, budget: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="class">Class</Label>
              <Select
                value={preferences.class}
                onValueChange={(value: 'economy' | 'business' | 'first') =>
                  setPreferences({ ...preferences, class: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="economy">Economy</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="first">First Class</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="directFlight">Direct flights only</Label>
              <Switch
                id="directFlight"
                checked={preferences.directFlight}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, directFlight: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="flexibleDates">Flexible dates</Label>
              <Switch
                id="flexibleDates"
                checked={preferences.flexibleDates}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, flexibleDates: checked })
                }
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              'Search Flights'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

