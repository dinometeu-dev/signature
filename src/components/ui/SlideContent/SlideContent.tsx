import { SlideContentClient } from '@/components/ui/SlideContent/SlideContentClient'
import { getWorkItems } from '@/lib/api/workItems'

const SlideContent = async () => {
  const { data: workItems } = await getWorkItems()

  if (!workItems) return null

  return <SlideContentClient workItems={workItems} />
}

SlideContent.displayName = 'SlideContent'

export { SlideContent }
