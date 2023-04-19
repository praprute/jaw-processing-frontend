import { useRouter } from 'next/router'

export const useNavigation = () => {
    const history = useRouter()

    return {
        navigateTo: {
            toBack: async () => {
                history.back()
            },
            signin: async () => {
                await history.push('/signin')
            },
            home: async () => {
                await history.push('/')
            },
            allPuddle: async (building_id: string) => {
                await history.push(`/puddle/${building_id}`)
            },
            detailPuddle: async (building_id: string, puddle_id: string) => {
                await history.push(`/puddle/detail/${building_id}/${puddle_id}`)
            },
            createOrder: async (uuid_puddle: string, puddle_id: string) => {
                await history.push(`/order/create?puddle_address=${uuid_puddle}&id=${puddle_id}`)
            },
            fishWeightReceive: async () => {
                await history.push(`fish-bill`)
            },
            createFishWeightReceive: async () => {
                await history.push(`fish-bill/create`)
            },
            SaltBillReceive: async () => {
                await history.push(`salt-bill`)
            },
            createSaltBillReceive: async () => {
                await history.push(`salt-bill/create`)
            },
        },
    }
}
