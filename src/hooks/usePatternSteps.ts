import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type {
  ChecklistItem,
  Pattern,
  PatternSection,
  PatternSkill,
  PatternStep,
  StepResource,
} from '@/types/database'

export interface ResourceRef {
  slug: string
  title: string
  summary: string | null
}

export interface StepLink extends ResourceRef {
  label: string | null
}

export interface ChecklistEntry extends ChecklistItem {
  resource: ResourceRef | null
}

export interface SkillEntry extends PatternSkill {
  resource: ResourceRef | null
}

interface UsePatternStepsResult {
  pattern: Pattern | null
  steps: PatternStep[]
  sections: PatternSection[]
  stepLinks: Map<number, StepLink[]>
  checklist: ChecklistEntry[]
  skills: SkillEntry[]
  loading: boolean
  error: string | null
  notFound: boolean
  reload: () => void
}

interface Loaded {
  id: number
  pattern: Pattern | null
  steps: PatternStep[]
  sections: PatternSection[]
  stepLinks: Map<number, StepLink[]>
  checklist: ChecklistEntry[]
  skills: SkillEntry[]
}

const NO_LINKS: Map<number, StepLink[]> = new Map()

export function usePatternSteps(patternId: number | null): UsePatternStepsResult {
  // Results are stored with the id they belong to, so navigating between
  // patterns never shows the previous pattern's data.
  const [loaded, setLoaded] = useState<Loaded | null>(null)
  const [failedId, setFailedId] = useState<number | null>(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    if (patternId === null) return
    let active = true

    async function load(id: number) {
      const [
        patternResult,
        stepsResult,
        sectionsResult,
        itemsResult,
        skillsResult,
        resourcesResult,
      ] = await Promise.all([
        supabase.from('patterns').select('*').eq('id', id).maybeSingle(),
        supabase
          .from('pattern_instructions')
          .select('*')
          .eq('pattern_id', id)
          .order('step_number'),
        supabase
          .from('pattern_sections')
          .select('*')
          .eq('pattern_id', id)
          .order('position'),
        supabase
          .from('pattern_checklist_items')
          .select('*')
          .eq('pattern_id', id)
          .order('position'),
        supabase
          .from('pattern_skills')
          .select('*')
          .eq('pattern_id', id)
          .order('position'),
        // The resource list is small; titles and slugs are joined in memory.
        supabase.from('resources').select('id, slug, title, summary'),
      ])
      if (!active) return
      if (
        patternResult.error ||
        stepsResult.error ||
        sectionsResult.error ||
        itemsResult.error ||
        skillsResult.error ||
        resourcesResult.error
      ) {
        setFailedId(id)
        return
      }

      const steps = stepsResult.data
      let linkRows: StepResource[] = []
      if (steps.length > 0) {
        const linksResult = await supabase
          .from('step_resources')
          .select('*')
          .in(
            'instruction_id',
            steps.map((step) => step.id),
          )
          .order('position')
        if (!active) return
        if (linksResult.error) {
          setFailedId(id)
          return
        }
        linkRows = linksResult.data
      }

      const refs = new Map<number, ResourceRef>(
        resourcesResult.data.map((row) => [
          row.id,
          { slug: row.slug, title: row.title, summary: row.summary },
        ]),
      )
      const refFor = (resourceId: number | null): ResourceRef | null =>
        resourceId === null ? null : (refs.get(resourceId) ?? null)

      const stepLinks = new Map<number, StepLink[]>()
      for (const row of linkRows) {
        const ref = refs.get(row.resource_id)
        if (!ref) continue
        const list = stepLinks.get(row.instruction_id) ?? []
        list.push({ ...ref, label: row.label })
        stepLinks.set(row.instruction_id, list)
      }

      setLoaded({
        id,
        pattern: patternResult.data,
        steps,
        sections: sectionsResult.data,
        stepLinks,
        checklist: itemsResult.data.map((item) => ({
          ...item,
          kind: item.kind as ChecklistItem['kind'],
          resource: refFor(item.resource_id),
        })),
        skills: skillsResult.data.map((skill) => ({
          ...skill,
          resource: refFor(skill.resource_id),
        })),
      })
    }

    void load(patternId)
    return () => {
      active = false
    }
  }, [patternId, version])

  function reload() {
    setFailedId(null)
    setVersion((current) => current + 1)
  }

  if (patternId === null) {
    return {
      pattern: null,
      steps: [],
      sections: [],
      stepLinks: NO_LINKS,
      checklist: [],
      skills: [],
      loading: false,
      error: null,
      notFound: true,
      reload,
    }
  }

  const current = loaded?.id === patternId ? loaded : null
  const error =
    failedId === patternId && !current
      ? 'Could not load this project. Please try again.'
      : null

  return {
    pattern: current?.pattern ?? null,
    steps: current?.steps ?? [],
    sections: current?.sections ?? [],
    stepLinks: current?.stepLinks ?? NO_LINKS,
    checklist: current?.checklist ?? [],
    skills: current?.skills ?? [],
    loading: !current && !error,
    error,
    notFound: current !== null && current.pattern === null,
    reload,
  }
}
