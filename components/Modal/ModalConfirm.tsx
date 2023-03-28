import { Button, Divider, Modal } from 'antd'
import styled from 'styled-components'

interface IModalConfirm {
    visible: boolean
    onClose: () => void
    title: string
    description: string
    onSubmit: () => void
}
const ModalConfirm = (props: IModalConfirm) => {
    const { visible, onClose, title, description, onSubmit } = props
    return (
        <StyledModal centered closable={false} footer={null} maskClosable={true} onCancel={onClose} open={visible}>
            <ContentModal>
                <StyledTitle>{title}</StyledTitle>
                <StyledDivider dashed />
                <span>{description}</span>
                <br />
                <SectionButton>
                    <Button onClick={onClose} type='dashed'>
                        ยกเลิก
                    </Button>
                    <StyledButton
                        onClick={() => {
                            onClose()
                            onSubmit()
                        }}
                        type='primary'
                    >
                        ยืนยัน
                    </StyledButton>
                </SectionButton>
            </ContentModal>
        </StyledModal>
    )
}

export default ModalConfirm
const StyledButton = styled(Button)`
    span {
        color: #ffffff !important;
    }
`

const SectionButton = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    justify-content: flex-end;
`

const StyledModal = styled(Modal)`
    .ant-modal-body {
        padding: 12px 10px;
    }
`
const StyledDivider = styled(Divider)`
    margin: 6px 0px 6px 0px;
`

const StyledTitle = styled.p`
    font-size: 18px;
    font-weight: 700;
    text-align: left;
`
const ContentModal = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: column;
    padding: 0px 0px;
    p {
        margin-bottom: 0px;
    }

    span {
        color: #00000066;
    }
`
