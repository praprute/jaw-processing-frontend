import { ReactElement, useEffect, useState } from 'react'
import { Breadcrumb, Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, Spin } from 'antd'
import Head from 'next/head'
import styled from 'styled-components'
import { NextPageWithLayout } from '../_app'
import AppLayout from '../../components/Layouts'
import { IAllPuddleDto, IPuddleBoxDto } from '../../share-module/building/type'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { createPuddleTask, getPuddleByIdBuilding, getPuddleByIdBuildingTask } from '../../share-module/building/task'
import dayjs from 'dayjs'
import FormInsertPuddle from '../../components/FormInsertPuddle'
import { NoticeError, NoticeSuccess } from '../../utils/noticeStatus'

const PuddlePage: NextPageWithLayout = () => {
  const router = useRouter()
  const [form] = Form.useForm()
  const { id } = router.query
  const [open, setOpen] = useState(false)
  const [tigger, setTigger] = useState(false)

  const getPuddleByIdBuilding = getPuddleByIdBuildingTask.useTask()
  const createPuddleRequest = createPuddleTask.useTask()

  useEffect(() => {
    ;(async () => {
      await getPuddleByIdBuilding.onRequest({ building_id: Number(id) })
    })()
  }, [id, tigger])

  useEffect(() => {
    if (id) {
      form.setFieldsValue({
        building_id: Number(id),
        date_create: dayjs(new Date()).format('DD/MM/YYYY')
      })
    }
  }, [id])

  const handleSubmitCreatePuddle = async () => {
    try {
      let payload = {
        building_id: form.getFieldValue('building_id')
      }
      const result = await createPuddleRequest.onRequest(payload)
      if (result.success === 'success') {
        setTigger(!tigger)
        NoticeSuccess('เพิ่มบ่อสำเร็จ')
      }
    } catch (err: any) {
      NoticeError('เพิ่มบ่อไม่สำเร็จ')
      setTigger(!tigger)
    } finally {
      onClose()
    }
  }

  const showDrawer = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Head>
        <title>Puddle | Jaw Management</title>
        <meta name="description" content="Jaw Management" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Breadcrumb style={{ margin: '16px 0', fontSize: '12px' }}>
        <Breadcrumb.Item>Process Menagement</Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href="/">อาคารทั้งหมด</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>รหัสอาคาร {id}</Breadcrumb.Item>
      </Breadcrumb>
      <StyledBoxHeader>
        <span>รหัสอาคาร {id}</span>
        <StyledButton type="primary" onClick={showDrawer}>
          ลงทะเบียนบ่อ
        </StyledButton>
      </StyledBoxHeader>
      <br />
      {getPuddleByIdBuilding.loading ? (
        <StyledLoadingContent>
          <Spin size="large" />
        </StyledLoadingContent>
      ) : (
        <Row gutter={[0, 0]}>
          {Boolean(getPuddleByIdBuilding?.data?.length) &&
            getPuddleByIdBuilding?.data?.map((data, index) => (
              <Col key={index} span={12} xs={24} sm={24} md={6}>
                <StyledGlassBox isStatus={data.status}>
                  <StyledTitleBetween>
                    <span>{data.idpuddle}</span>
                    <span>
                      {dayjs(data.update_time).format('DD/MM/YYYY')} {data.status === 1 && <span>ลงปลา</span>}
                      {data.status === 0 && <span>ว่าง</span>}
                      {data.status === 1 && <span>ลงปลา</span>}
                      {data.status === 2 && <span>เติมน้ำปลา</span>}
                      {data.status === 3 && <span>ถ่ายน้ำปลาออก</span>}
                    </span>
                    <span>{data.description}</span>
                  </StyledTitleBetween>
                </StyledGlassBox>
              </Col>
            ))}
        </Row>
      )}

      <StyledDrawe
        title="เพิ่มบ่อ"
        width={720}
        onClose={onClose}
        open={open}
        bodyStyle={{ paddingBottom: 80 }}
        extra={
          <Space>
            <Button type="ghost" style={{ color: '#FFFFFF' }} onClick={onClose}>
              Cancel
            </Button>
            <Button type="primary" onClick={handleSubmitCreatePuddle}>
              Submit
            </Button>
          </Space>
        }>
        <Form form={form} layout="vertical" hideRequiredMark autoComplete="off">
          <FormInsertPuddle />
        </Form>
      </StyledDrawe>
    </>
  )
}

PuddlePage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>
      <>{page}</>
    </AppLayout>
  )
}

export default PuddlePage

const StyledLoadingContent = styled.div`
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  min-height: 50vh;
`
const StyledDrawe = styled(Drawer)`
  .ant-drawer-header {
    background: rgb(26, 28, 33) !important;
  }
  .ant-drawer-close {
    color: #ffffff !important;
  }
  .ant-drawer-title {
    color: #ffffff !important;
  }
  .ant-drawer-body {
    background: rgb(255, 255, 255) !important;
  }
`
const StyledButton = styled(Button)`
  border-radius: 8px;
`
const StyledTitleBetween = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
`
const StyledGlassBox = styled.div<{ isStatus: number }>`
  ${(p) => {
    if (p.isStatus === 1) {
      return `background:#FC0F0f;`
    }
    if (p.isStatus === 0) {
      return `background:#66C4E2;`
    }
  }}
  border-radius: 0px;
  border: 0.1px solid #ffffff66;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5.3px);
  -webkit-backdrop-filter: blur(5.3px);
  width: 100%;
  padding: 10px 20px;
  cursor: pointer;
`
const StyledBoxHeader = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5.3px);
  -webkit-backdrop-filter: blur(5.3px);
  width: 100%;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`
