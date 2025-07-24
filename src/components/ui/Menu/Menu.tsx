import { getMenu } from '@/lib/api/menu'
import { MenuClient } from '@/components/ui/Menu/MenuClient'

const Menu = async () => {
  const { data: menu } = await getMenu()

  if (!menu) return null

  return <MenuClient menu={menu} />
}

Menu.displayName = 'Menu'

export { Menu }
