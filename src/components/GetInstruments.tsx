import { useEffect, useState } from 'react'
// @ts-expect-error javascript file has no type declaration
import { supabase } from '../lib/supabaseClient.js'

// Temporary instrument type interface until real data is used
interface Instrument {
  id: number
  name: string
}

export default function GetInstruments() {
  const [instruments, setInstruments] = useState<Instrument[]>([])

  // Temp async function to prevent typescript errors
  useEffect(() => {
    async function getInstruments() {
      const { data, error } = await supabase.from('instruments').select()

      if (error) {
        console.error(error)
        return
      }

      setInstruments(data)
    }

    getInstruments()
  }, [])

  return (
    <ul>
      {instruments.map((instrument) => (
        <li key={instrument.id}>{instrument.name}</li>
      ))}
    </ul>
  )
}
