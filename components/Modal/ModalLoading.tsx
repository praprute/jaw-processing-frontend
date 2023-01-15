import { Modal, Spin } from 'antd'
import styled from 'styled-components'

interface IModalLoading {
    visible: boolean
    onClose: () => void
}
const ModalLoading = (props: IModalLoading) => {
    const { visible, onClose } = props
    return (
        <Modal centered closable={false} footer={null} maskClosable={false} onCancel={onClose} open={visible} width={280}>
            <ContentModal>
                <Spin size='large' />
                <br />
                <p>กำลังทำรายการ</p>
                <span>กรุณารอสักครู่</span>
            </ContentModal>
        </Modal>
    )
}

export default ModalLoading

const ContentModal = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: column;
    padding: 10px 0px;
    p {
        margin-bottom: 0px;
    }

    span {
        color: #00000066;
    }
`
