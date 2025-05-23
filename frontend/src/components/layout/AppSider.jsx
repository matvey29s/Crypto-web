import { Layout, Card, Statistic, List, Typography, Tag } from 'antd'
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import { capitalize } from '../../utils'
import { useContext,useState,useEffect } from 'react'
import CryptoContext from '../../context/crypto-context'
import CountUp from 'react-countup'

const siderStyle = {
  padding: '1rem',
}

export default function AppSider() {
  const { assets } = useContext(CryptoContext)
  const [prevValues, setPrevValues] = useState({})
  const [currentValues, setCurrentValues] = useState({})

  useEffect(() => {
    const newPrevValues = {}
    const newCurrentValues = {}
    
    assets.forEach(asset => {
      newPrevValues[asset.id] = currentValues[asset.id] || 0
      newCurrentValues[asset.id] = asset.totalAmount
    })
    
    setPrevValues(newPrevValues)
    setCurrentValues(newCurrentValues)
  }, [assets])

  return (
    <Layout.Sider width="25%" style={siderStyle}>
      {assets.map((asset) => (
        <Card key={asset.id} style={{ marginBottom: '1rem' }}>
          <Statistic
            title={capitalize(asset.id)}
            valueRender={() => (
              <CountUp
                start={prevValues[asset.id] || 0}
                end={currentValues[asset.id] || 0}
                duration={1}
                decimals={2}
                prefix={asset.grow ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                suffix="$"
                formattingFn={(value) => '$ '+value.toFixed(2)}
              />
            )}
            valueStyle={{ color: asset.grow ? '#3f8600' : '#cf1322' }}
          />
          <List
            size="small"
            dataSource={[
              {
                title: 'Total Profit',
                value: asset.totalProfit,
                withTag: true,
              },
              { title: 'Asset Amount', value: asset.amount, isPlain: true },
            ]}
            renderItem={(item) => (
              <List.Item>
                <span>{item.title}</span>
                <span>
                  {item.withTag && (
                    <Tag color={asset.grow ? 'green' : 'red'}>
                      {asset.growPercent}%
                    </Tag>
                  )}
                  {item.isPlain && item.value}
                  {!item.isPlain && (
                    <Typography.Text type={asset.grow ? 'success' : 'danger'}>
                      <CountUp
                        end={item.value}
                        duration={1}
                        decimals={2}
                        suffix="$"
                      />
                    </Typography.Text>
                  )}
                </span>
              </List.Item>
            )}
          />
        </Card>
      ))}
    </Layout.Sider>
  )
}