import { useEffect, useState } from 'react'
// @ts-expect-error javascript file has no type declaration
import { supabase } from '../lib/supabaseClient.js'

interface Instrument {
  id: number
  name: string
}

export default function GetInstruments() {
  const [instruments, setInstruments] = useState<Instrument[]>([])

  useEffect(() => {
    async function getInstruments() {
      const { data } = await supabase.from('instruments').select()

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
