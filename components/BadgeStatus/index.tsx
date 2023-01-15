import { Tag } from 'antd'
import React from 'react'
import styled from 'styled-components'

interface IBadgeStatus {
    status: number
}

const BadgeStatus = (props: IBadgeStatus) => {
    const { status } = props

    switch (status) {
        case 0:
            return <StyledTag color='#2db7f5'>บ่อว่าง</StyledTag>
        case 1:
            return <StyledTag color='#FC0F0f'>บ่อหมัก</StyledTag>
        case 2:
            return <StyledTag color='#faad14'>บ่อเวียน</StyledTag>
        default:
            break
    }
}

export default BadgeStatus

const StyledTag = styled(Tag)<{ isStatus?: number }>`
    border-radius: 12px;
    font-size: 12px;
    padding: 0px 15px;
`
