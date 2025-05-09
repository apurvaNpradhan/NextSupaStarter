import Header from "@/components/header"
import CollectionList from "@/features/collections/components/collection-list"
import { collectionService } from "@/features/collections/server/db/collections"
import { getUser } from "@/lib/supabase/server"
import { ThemeToggle } from "../playground/_blocks/theme/components"
import { ContentLayout } from "@/components/layouts/content-layout"

export default async function CollectionsPage() {
  const user = await getUser()
  if (!user) {
    return <div>Unauthorized</div>
  }
  const collectionData = await collectionService.getByUser(user.id)
  return (
    <>
      <Header component={<ThemeToggle />} />
      <ContentLayout title="Collections">
        <CollectionList userId={user.id} collections={collectionData} />
      </ContentLayout>
    </>
  )
}
