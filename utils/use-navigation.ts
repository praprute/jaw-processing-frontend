import { useRouter } from 'next/router'

export const useNavigation = () => {
    const history = useRouter()

    return {
        navigateTo: {
            home: async () => {
                await history.push('/')
            },
            allPuddle: async (building_id: string) => {
                await history.push(`/puddle/${building_id}`)
            },
            detailPuddle: async (building_id: string, puddle_id: string) => {
                await history.push(`/puddle/detail/${building_id}/${puddle_id}`)
            },
        },
    }
}
