import { useRouter } from 'next/router'
import { Fragment } from 'react'
import styled, { css } from 'styled-components'

interface ILeftMenu {
    menus: {
        name: string
        path: string
        active: boolean
    }[]
}
const LeftMenu = (props: ILeftMenu) => {
    const { menus } = props

    const router = useRouter()

    return (
        <Container>
            {menus.map((data, index) => (
                <Fragment key={index}>
                    <MenuWrapper $active={data.active} onClick={() => router.push(data.path)}>
                        {data.name}
                    </MenuWrapper>
                </Fragment>
            ))}
        </Container>
    )
}

export default LeftMenu

const Container = styled.div`
    width: 100%;
    padding: 24px;
`
const MenuWrapper = styled.div<{ $active: boolean }>`
    height: 48px;
    margin: 8px auto;
    display: flex;
    align-items: center;
    border-left: 4px solid white;
    cursor: pointer;
    ${({ $active }) =>
        $active &&
        css`
            border-left: 4px solid #47d344;
            background: #e7f7ef;
            margin: 8px -18px;
            padding: 18px;
        `}
`
