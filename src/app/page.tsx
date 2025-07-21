import { Menu } from '@/components/Menu'

export default function Home() {
  return (
    <div
      className={
        'h-full w-full grid grid-cols-(--grid-template-cols-main-layout)'
      }
    >
      <Menu />
      <div>COntent</div>
      <div>Blank</div>
      {/*<Slide mouseContainer={containerRef}>Test slide</Slide>*/}
    </div>
  )
}
