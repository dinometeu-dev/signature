import { getMenu } from '@/lib/api/menu'

const Menu = async () => {
  const { data: menu } = await getMenu()

  return (
    <div className={'w-full h-full flex flex-col items-center justify-center'}>
      {menu?.map(({ id, title }) => (
        <p key={id}>{title}</p>
      ))}
    </div>
  )
}

Menu.displayName = 'Menu'

export { Menu }
